import { TypeTagMap } from './utils'
import { RULE_INLINE_BACKTICK } from './ruleName'
import type { InlineToken, State, Paitor } from '../../type'

/**
 * 反勾字符串是一对或多对反勾字符(')组成的字符串，前后不带反勾
 * @param {InlineToken} token 
 * @param {State} state 
 * @param {Paitor} paitor
 */
function rule(token: InlineToken, state: State, paitor: Paitor) {
  const { src, length } = token
  const start = token.pos
  if(start >= length) return true
  
  const markChar = src.charCodeAt(start)
  if (markChar !== 0x60) return false

  let pos = start+1
  let startMarkCount = 1
  // 其实起始标记`字符的数量
  while(pos < length && src.charCodeAt(pos) === 0x60) {
    startMarkCount++
    pos++
  }
  const startMark = src.slice(start, pos)
  let endMarkPos = -1
  // 寻找闭合标记
  if ((endMarkPos = src.indexOf(startMark, pos)) === -1) {
    // 未找到，即当前的标记没有配对的闭合标记，则将标记内容作为普通文本显示
    token.pushContent(startMark)
    token.pos = pos
    return true
  }
  
  let noCloseMark = false
  let curPos = endMarkPos + startMarkCount
  while(curPos < length && src.charCodeAt(curPos) === 0x60) {
    endMarkPos = src.indexOf(startMark, curPos)
    if(endMarkPos === -1) {
      noCloseMark = true
      break
    }
    curPos = endMarkPos + startMarkCount
  }

  if(noCloseMark) {
    token.pushContent(startMark)
    token.pos = pos
    return true
  }

  token.pushTypeContent(
    TypeTagMap[rule.ruleName], 
    src.slice(pos, endMarkPos)
  )
  token.pos = endMarkPos + startMarkCount

  return true
}

rule.ruleName = RULE_INLINE_BACKTICK

export default rule
