import { RULE_FENCE } from './ruleName'
import Token from '../../state/token'
import type { State, Paitor, TLineMeta } from '../../type'

/**
 * 栅格代码块
 * ```或~~~包裹的内容
 * @param {TLineMeta} lineMeta 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(lineMeta: TLineMeta, state: State, paitor: Paitor, silent = false) {
  const { empty, line, indent, offset, text, length } = lineMeta
  if (indent >= 4 || offset+3>length) return false
  if (empty) return line + 1
  
  const firstChar = text.charCodeAt(offset)

  if(firstChar !== 0x7E/* ~ */ && firstChar !== 0x60/* ` */) {
    return false
  }

  let pos = offset
  while(pos < length) {
    if(text.charCodeAt(pos) !== firstChar) break
    pos++
  }
  const markLength = pos - offset
  if(markLength < 3) return false

  const marks = text.slice(offset, pos)
  const params = text.slice(pos).trim()

  // 若代码块标记是`，则在满足条件情况后，后面跟着的字符中不能出现`字符
  if(firstChar === 0x60 && params.indexOf(String.fromCharCode(firstChar)) >= 0) {
    return false
  }
  
  const lines = state.lines
  let nextLine = line
  while(nextLine < lines) {
    nextLine++
    if(nextLine >= lines) break
    const nextLineMeta = state.getLineMeta(nextLine)
    if(nextLineMeta.empty || nextLineMeta.indent >= 4) {
      continue
    }
    if(nextLineMeta.text.indexOf(marks) === nextLineMeta.offset) {
      break
    }
  }

  if(silent) return true

  const token = new Token({
    type: rule.ruleName,
    tag: 'code',
    lines: [line, nextLine],
    content: state.getRangeMetas(line+1, nextLine-1).map(meta => meta.text),
  })

  if(params) {
    token.attrs = {
      'class': `language-${params.split(/\s+/g)[0]}`
    }
  }

  state.pushToken(token)

  return nextLine+1
}

rule.ruleName = RULE_FENCE

export default rule