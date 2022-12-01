import { 
  RULE_REFERENCE, 
  RULE_FENCE, 
  RULE_HR,
  RULE_HEADING,
  RULE_SETEXTHEADING,
} from './ruleName'
import Token from '../../state/token'
import { isSpace, skipSpace, isWhiteSpace } from '../../utils'
import type { State, Paitor, TLineMeta } from '../../type'

const titleReg1 = /^'(.*(?:\n*.*)*)'\s*$/
const titleReg2 = /^"(.*(?:\n*.*)*)"\s*$/

/**
 * 链接引用定义块
 * @param {TLineMeta} lineMeta 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(lineMeta: TLineMeta, state: State, paitor: Paitor, silent = false) {
  const { empty, text, line, indent, offset } = lineMeta
  if (indent >= 4) return false
  if (empty) return line + 1

  const lines = state.lines
  const firstChar = text.charCodeAt(offset) 
  let nextLine = line + 1
  // 判断首个字符是不是 '['
  if(firstChar !== 0x5B) return false

  // 遍历后续行，直到遇到符合其他规则的行或结束
  const terminatorRules = paitor.block.ruler.getRules(RULE_REFERENCE)
  while(nextLine < lines) {
    if (state.isEmptyLine(nextLine)) {
      nextLine--
      break // 空行，退出循环
    }
    let terminate = false
    const nextLineMeta = state.getLineMeta(nextLine)
    for(let i=0; i<terminatorRules.length; i++) {
      terminate = terminatorRules[i](
        nextLineMeta,
        state,
        paitor,
        true
      ) as boolean
      if(terminate) {
        break
      }
    }
    if(terminate) {
      nextLine--  // 当前遍历到的行满足其他规则，返回到上一行，退出循环
      break
    }

    // 继续下一行
    nextLine++
  }

  const content = state.getRangeMetas(line, nextLine).map(meta => meta.text.trim()).join('\n')
  const length = content.length
  let pos = offset, label = '', url = '', title = ''

  while(++pos < length) {
    // 判断是否满足 [xxx]:url，注意，']'字符前不能有'\'
    if(
      content.charCodeAt(pos) === 0x5D/* ] */ &&
      content.charCodeAt(pos-1) !== 0x5C/* \ */
    ) {
      // 判断 ’]‘ 是否为结束字符
      if(pos+1>=length) return false
      // 判断[xxx]后面是否紧跟着 ':' 字符
      if(content.charCodeAt(pos+1) !== 0x3A/* : */) return false
      // [] 里面必须有内容
      if(content.charCodeAt(pos-1) === 0x5B) return false
      
      // 设置到’:‘字符后面的第一个非空字符处
      pos = skipSpace(content, pos+2)
      break
    } else {
      label += content.charAt(pos)
    }
  }

  if(pos >= length) return false

  // 提取url内容，直到遇到空格或换行
  for(; pos<length; pos++) {
    url += content.charAt(pos)
    const charCode = content.charCodeAt(pos + 1)
    if(isSpace(charCode) || isWhiteSpace(charCode)) {
      pos++
      break
    }
  }

  // 链接不能为空
  if(!url) return false
  // <>表示空连接

  // 跳过所有连续空格，和换行
  pos = skipSpace(content, pos)
  if(isWhiteSpace(content.charCodeAt(pos))) pos++
  const quote = content.charCodeAt(pos)
  let closed = false
  // title内容在 "" 或 '' 中
  if(quote !== 0x22 && quote !== 0x27) {
    return false
  } else {
    pos++
  }
  for(; pos<length; pos++) {
    const char = content.charAt(pos)
    if (content.charCodeAt(pos) === quote && content.charCodeAt(pos - 1) !== 0x5C) {
      closed = true
      pos = skipSpace(content, pos+1)
      break
    } else {
      title += char
    }
  }
  if(!closed) return false

  if(pos < length) return false

  if(silent) return true

  const token = new Token({
    label,
    url,
    title,
    lines: [line, nextLine]
  })
  state.pushReferenceToken(token)

  return nextLine + 1
}

rule.ruleName = RULE_REFERENCE
rule.terminators = [RULE_FENCE, RULE_HR, RULE_HEADING, RULE_SETEXTHEADING]

export default rule