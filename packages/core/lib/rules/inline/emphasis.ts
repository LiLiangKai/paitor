import { TypeTagMap } from './utils'
import { RULE_INLINE_EMPHASIS, RULE_INLINE_STRONG } from './ruleName'
import type { InlineToken, State, Paitor } from '../../type'

/**
 * 
 * @param {InlineToken} token 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(token: InlineToken, state: State, paitor: Paitor, silent?: boolean) {
  const { src, length } = token
  const start = token.pos
  if(start >= length) return true
  const markChar = src.charCodeAt(start)

  if(markChar !== 0x2A /* * */ && markChar !== 0x5F /* _ */) return false

  let pos = start + 1
  let startMarkCount = 1
  // 记录起始标记的数量
  while(pos < length && src.charCodeAt(pos) === markChar) {
    pos++
    startMarkCount++
  }
  const startMark = src.slice(start, pos)
  const ruleName = startMarkCount > 1 ? RULE_INLINE_STRONG : RULE_INLINE_EMPHASIS

  // 判断在标记栈顶是否有匹配的标记，如果有，这改标记是闭合标记，否则是初始标记
  if(token.hasSameMarkInStackTop(startMark)) {
    token.markStackPop()
    token.pushTypeContent(TypeTagMap[ruleName])
    token.pos = pos
    return true
  }

  let endMarkPos = src.indexOf(startMark, pos)
  
  // 寻找是否有闭合标记
  if(endMarkPos === -1) {
    // 为找到闭合标记，则将标记内容作为普通文本显示
    token.pushContent(startMark)
    token.pos = pos
    return true
  }
  let noCloseMark = false
  let curPos = endMarkPos + startMarkCount
  // 闭合标记一定要和起始标记相等
  while(curPos < length && src.charCodeAt(curPos) === markChar) {
    endMarkPos = src.indexOf(startMark, curPos)
    if(endMarkPos === -1) {
      noCloseMark = true
      break
    }
    curPos = endMarkPos + startMarkCount
  }

  if(noCloseMark) { 
    // 没有闭合标记，作为普通文本
    token.pushContent(startMark)
  } else {
    // 存在匹配的闭合标记，存入标记栈中
    token.markStackPush(startMark)
    token.pushTypeContent(TypeTagMap[ruleName])
  }

  token.pos = pos

  return false
}

rule.ruleName = RULE_INLINE_EMPHASIS

export default rule