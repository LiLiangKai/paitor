import { RULE_INLINE_EMPHASIS } from './ruleName'
import type { IToken, State, Paitor } from '../../type'

/**
 * 
 * @param {IToken} token 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(token: IToken, state: State, paitor: Paitor, silent?: boolean) {
  return false
}

rule.ruleName = RULE_INLINE_EMPHASIS

export default rule