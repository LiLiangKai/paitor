// import Token from '../../state/token'
// import { isSpace } from '../../utils'

import { RULE_BLOCKQUOTE } from './ruleName'
import type { State, Paitor, TLineMeta } from '../../type'

/**
 * 引用块
 * @param {TLineMeta} lineMeta 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(lineMeta: TLineMeta, state: State, paitor: Paitor, silent = false) {
  return false
}

rule.ruleName = RULE_BLOCKQUOTE

export default rule