import { RULE_INLINE_TEXT } from './ruleName'
import type { InlineToken, State, Paitor } from '../../type'

/**
 * 
 * @param {InlineToken} token 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(token: InlineToken, state: State, paitor: Paitor, silent?: boolean) {
  const {src, length} = token
  const start = token.pos
  let pos = start

  // 1234`123
  while (pos < length && !isTerminatorChar(src.charCodeAt(pos))) {
    pos++
  }

  if(pos === start) return false

  token.pushContent(src.slice(start, pos))
  token.pos = pos

  return true
}

rule.ruleName = RULE_INLINE_TEXT

export default rule

function isTerminatorChar(charCode: number) {
  switch(charCode) {
    // case 0x0A: // \n
    // case 0x21: // !
    case 0x2A: // *
    // case 0x5B: // [
    // case 0x5D: // ]
    case 0x5F: // _
    case 0x60: // `
      return true
    default:
      return false
  }
}