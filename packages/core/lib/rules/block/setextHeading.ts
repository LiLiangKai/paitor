import { RULE_SETEXTHEADING } from './ruleName'
import Token from '../../state/token'
import type { State, Paitor, TLineMeta } from '../../type'

/**
 * 文本标题块
 * 文本行后跟由-字符或=字符组成的行，行至少包含一个-或=字符，且不能包含其他字符，包括空格
 * @param {TLineMeta} lineMeta 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(lineMeta: TLineMeta, state: State, paitor: Paitor, silent = false) {
  const { empty, line, offset, indent } = lineMeta
  if (indent >= 4) return false
  if (empty) return line + 1

  const lines = state.lines
  let level = 0
  let nextLine = line+1
  for (;nextLine < lines && !state.isEmptyLine(nextLine); nextLine++) {
    const nextLineMeta = state.getLineMeta(nextLine)
    if(nextLineMeta.offset>4) continue
    
    const firstChar = nextLineMeta.text.charAt(offset)
    if(firstChar === '=' || firstChar === '-') {
      const str = nextLineMeta.text.trim()
      if(/^[=]+$/.test(str)) {
        // === 表示h1
        level = 1
        break
      }
      if(/^[-]+$/.test(str)) {
        // --- 表示h2
        level = 2
        break
      }
    }
  }
 
  if(!level) return false

  if (silent) return true

  const token = new Token({
    type: rule.ruleName,
    tag: `h${level}`,
    level,
    lines: [line, nextLine],
    content: state.getRangeMetas(line, nextLine-1).map(meta => meta.text.trim())
  })
  state.pushToken(token)

  return nextLine + 1
}

rule.ruleName = RULE_SETEXTHEADING

export default rule