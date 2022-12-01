import { RULE_PARAGRAPH } from './ruleName'
import Token from '../../state/token'
import type { State, Paitor, TLineMeta } from '../../type'

/**
 * 段落块
 * 段落的分割需要空行，在遇到空行前都为一个段落块的内容
 * @param {TLineMeta} lineMeta 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(lineMeta: TLineMeta, state: State, paitor: Paitor, silent = false) {
  const { empty, line, indent } = lineMeta
  if (indent >= 4) return false
  if(empty) return line+1

  let nextLine = line + 1
  while(!state.isEmptyLine(nextLine)) nextLine++

  if (silent) return true

  const token = new Token({
    type: rule.ruleName,
    tag: 'p',
    lines: [line, nextLine-1],
    content: state.getRangeMetas(line, nextLine-1).map(meta => meta.text.trim())
  })
  state.pushToken(token)

  return nextLine
}

rule.ruleName = RULE_PARAGRAPH

export default rule