import { RULE_HR } from './ruleName'
import Token from '../../state/token'
import { isSpace } from '../../utils'
import type { State, Paitor, TLineMeta } from '../../type'

/**
 * 分割行
 * 由三个或多个匹配的-、_、或*字符组成，要求除空格外，所有字符都一样, 前后不需要换行
 * @param {TLineMeta} lineMeta 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(lineMeta: TLineMeta, state: State, paitor: Paitor, silent = false) {
  const { empty, text, line, indent, offset, length } = lineMeta
  if (indent >= 4) return false
  if (empty) return line + 1

  let pos = offset
  const firstChar = text.charCodeAt(pos++)
  if (
    firstChar !== 0x2A && // *
    firstChar !== 0x2D && // -
    firstChar !== 0x5F    // _
  ) {
    return false
  }

  let count = 1
  while(pos < length) {
    const char = text.charCodeAt(pos++)
    if(char !== firstChar && !isSpace(char)) return false
    if(char === firstChar) count++
  }

  if(count < 3) return false

  if(silent) return true

  const token = new Token({
    type: rule.ruleName,
    tag: 'hr',
    lines: [line, line],
  })
  state.pushToken(token)

  return line+1
}

rule.ruleName = RULE_HR

export default rule