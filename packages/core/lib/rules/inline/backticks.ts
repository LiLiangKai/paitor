import Text from './text'
import { pushContent, pushTypeContent } from './utils'
import { RULE_INLINE_BACKTICK } from './ruleName'
import type { IToken, State, Paitor } from '../../type'

/**
 * 反勾字符串是一对或多对反勾字符(')组成的字符串，前后不带反勾
 * @param {IToken} token 
 * @param {State} state 
 * @param {Paitor} paitor
 */
function rule(token: IToken, state: State, paitor: Paitor) {
  const { src, length, content } = token
  const start = token.pos
  if(start >= length) return true
  
  const markChar = src.charCodeAt(start)
  if (markChar !== 0x60) return false

  let pos = start+1
  let startMarkCount = 1
  let endMarkCount = 0
  // 其实起始标记`字符的数量
  while(pos < length && src.charCodeAt(pos) === 0x60) {
    startMarkCount++
    pos++
  }
  // 跳过非`字符
  while(pos < length && src.charCodeAt(pos) !== 0x60) {
    pos++
  }

  // 其实结束标记`字符的数量
  while (pos < length && src.charCodeAt(pos) === 0x60) {
    endMarkCount++
    pos++
  }

  if(pos >= length || endMarkCount!==startMarkCount) {
    let nextPos = start + startMarkCount
    let text = src.slice(start, nextPos)
    if(endMarkCount > 0) {
      text = src.slice(start, pos-1)
      nextPos = pos
    }
    // 未找到结束`字符
    pushContent(content, text)
    token.pos = nextPos
    return Text(token, state, paitor)
  }

  pushTypeContent(
    content,
    src.slice(start+startMarkCount, pos-endMarkCount),
    rule.ruleName,
  )
  token.pos = pos

  return true
}

rule.ruleName = RULE_INLINE_BACKTICK

export default rule
