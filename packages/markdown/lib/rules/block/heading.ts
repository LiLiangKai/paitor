import { RULE_HEADING } from './ruleName'
import Token from '../../state/token'
import { isSpace } from '../../utils'
import type { State, Paitor, TLineMeta } from '../../type'

/**
 * 标题块
 * @param {TLineMeta} lineMeta 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(lineMeta: TLineMeta, state: State, paitor: Paitor, silent = false) {
  const { empty, text, line, offset, indent } = lineMeta
  if (indent >= 4) return false
  if(empty) return line+1

  let l = offset
  // 计算起始位置的‘#’字符数量，如果一系列‘#’后面跟着空格，才是标题块
  while (text.charCodeAt(l) === 0x23) l++
  
  const level = l - offset

  if (level > 6 || !isSpace(text.charCodeAt(l))) {
    // ‘#’字符数量 >6 或者后面没跟着空格
    return false
  }

  if(silent) return true

  const token = new Token({
    type: rule.ruleName,
    tag: `h${level}`,
    level,
    lines: [line, line],
    content: [text.slice(l).replace(/\s+#+(?:\s+)?$/, '').trim()]
  })
  state.pushToken(token)

  return line+1
}

rule.ruleName = RULE_HEADING

export default rule