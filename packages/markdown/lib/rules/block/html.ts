import { RULE_HTML } from './ruleName'
import type { State, Paitor, TLineMeta } from '../../type'

/**
 * HTML内容块
 * @param {TLineMeta} lineMeta 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(lineMeta: TLineMeta, state: State, paitor: Paitor, silent = false) {
  const { empty, line, indent } = lineMeta
  if (indent >= 4) return false
  if (empty) return line + 1

  if(silent) return true
  
  return false
}

rule.ruleName = RULE_HTML

export default rule