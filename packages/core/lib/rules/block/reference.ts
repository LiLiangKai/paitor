import { 
  RULE_REFERENCE, 
  RULE_FENCE, 
  RULE_HR,
  RULE_HEADING,
  RULE_SETEXTHEADING,
} from './ruleName'
import Token from '../../state/token'
import { isSpace, skipSpace } from '../../utils'
import type { State, Paitor, TLineMeta } from '../../type'


/**
 * 链接引用定义块
 * 格式：[label]: \<url destination\> 'url title'；
 * [label]不能有换行, ]后续需要跟着: ，:后的空格可以省略；
 * \<url destination\>整体可以在 : 后换行，但不能在其中任一位置换行，空连接使用<>表示，如果内容不为空，可以省略<>，如果内容出现(), 则()必须成对出现；
 * 'url title'与<url destination>之间需要有空格，或直接换行，可以在任一位置换行，但不能出现空行；
 * url title内容必须在'',"",()之中，结尾标记后除了空格和\n，不能有其他任意字符；
 * 
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

  const content = state.getRangeMetas(line, nextLine).map(meta => meta.text).join('\n')
  const length = content.length
  let pos = offset, label = '', url = '', title = ''
  let curLine = line

  // 提取label，即 [label]
  //               ^^^^
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
  if(!label) return false
  if(pos >= length) return false

  if (content.charCodeAt(pos) === 0x0A) {
    curLine++
    pos++
  }

  const destination = parseLinkDestination(content, pos)
  if(!destination.ok) return false
  url = destination.text
  pos = destination.pos
  // url destination 后面需要跟着空格或\n
  if (!isSpace(content.charCodeAt(pos)) && content.charCodeAt(pos) !== 0x0A) return false

  // 跳过所有连续空格，和换行
  const destEndPos = skipSpace(content, pos)
  pos = destEndPos

  if (content.charCodeAt(pos) === 0x0A) {
    curLine++
    pos++
  }

  const linkTitle = parseLinkTitle(content, pos, curLine)
  if(linkTitle.ok) {
    title = linkTitle.text
    pos = skipSpace(content, linkTitle.pos)
    nextLine = linkTitle.line
  }

  // 除了\n，不能有其他字符
  if(pos < length && content.charCodeAt(pos) !== 0x0A) {
    pos = skipSpace(content, destEndPos)
    nextLine = curLine-1 // 退回到正确的行上
    if (pos < length && content.charCodeAt(pos) !== 0x0A) return false
  }

  if(nextLine < line) return false

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

/**
 * 扫描文本，提取格式: [label]: <url destination> 中的‘url destination’内容
 * 如果存在<>，提取<>里面的内容
 * 如果没有<>，提取所有内容直到遇到空格或换行
 * 如果内容中出现()，需要成对出现
 * @param str 文本
 * @param start 扫描起始位置
 * @returns 
 */
function parseLinkDestination(str: string, start: number) {
  let pos = start
  const length = str.length
  const result = {
    ok: false,
    pos,
    text: '',
  }
  // 是否以 < 开头
  if(str.charCodeAt(pos) === 0x3C /* < */) {
    pos++
    while(pos < length) {
      const code = str.charCodeAt(pos)
      if(code === 0x0A /* \n */) return result
      if(code === 0x3C) return result
      if(code === 0x3E /* > */) {
        result.pos = pos+1
        result.text = str.slice(start+1, pos)
        result.ok = true
        return result
      }
      if(code === 0x5C /* \ */ && pos+1 < length) {
        pos += 2
        continue
      }
      pos++
    } 
    // 没有 >
    return result
  }

  let brackets = 0
  while(pos < length) {
    const code = str.charCodeAt(pos)
    if(isSpace(code)) break
    if(code === 0x0A /* \n */) break
    if(code === 0x5C && pos+1 < length) {
      if(isSpace(str.charCodeAt(pos+1))) break
      pos += 2
      continue
    }
    // 如果存在括号()，需要成对出现
    if(code === 0x28 /* ( */) {
      brackets++
      if(brackets > 32) return result
    } else if(code === 0x29 /* ) */) {
      brackets--
    }
    pos++
  }

  if(start === pos) return result
  if(brackets !== 0) return result

  result.ok = true
  result.pos = pos
  result.text = str.slice(start, pos)

  return result
}

/**
 * 扫描文本，提取格式: [label]: <url destination> 'title' 中的‘title’内容
 * title内容由"", '', () 包裹
 * @param str 文本
 * @param start 扫描起始位置
 */
function parseLinkTitle(str: string, start: number, curLine: number) {
  let pos = start
  let line = curLine
  const length = str.length
  const result = {
    text: '',
    pos,
    ok: false,
    line,
  }
  let markChar = str.charCodeAt(pos)
  // title内容在 "", '', ()中
  if (markChar !== 0x22 && markChar !== 0x27 && markChar !== 0x28) {
    return result
  }
  pos++
  // 如果是由(开始，则由）结束
  if (markChar === 0x28) markChar = 0x29


  while(pos < length) {
    const code = str.charCodeAt(pos)
    if(code === markChar) {
      pos++
      result.pos = pos
      result.text = str.slice(start+1, pos)
      result.ok = true
      result.line = line
      break
    }
    if(code === 0x0A /* \n */) {
      line++
    }
    if (code === 0x28 /* ( */ && markChar === 0x29) return result
    if (code === 0x5C /* \ */ && pos+1<length) {
      pos++
    }
    pos++
  }

  return result
}