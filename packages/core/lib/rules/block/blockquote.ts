import Token from '../../state/token'
import { trim } from '../../utils'
import { 
  RULE_BLOCKQUOTE_BLOCK,
  RULE_BLOCKQUOTE_CONTENT,
} from './ruleName'
import type { State, Paitor, TLineMeta } from '../../type'

/*
引用块
以 > 字符为起始的行，>字符后面可不跟着空格
两种情况：
--------------
第一种情况
> 第一行
>> 第二行
>>> 第三行
该情况，存在嵌套关系，第三行嵌套在第二行中，第二行嵌套在第一行中
--------------
第二种情况
>>> 第一行
>> 第二行
> 第三行
该情况，不存在嵌套关系，第一、二、三行都是同一个引用块的内容
*/

/**
 * 引用块
 * 以 > 字符为起始的行，>字符后面可不跟着空格
 * @param {TLineMeta} lineMeta 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(lineMeta: TLineMeta, state: State, paitor: Paitor, silent = false) {
  const { text, empty, line, indent, offset } = lineMeta
  if(indent >= 4) return false
  if(empty) return line+1
  
  const firstChar = text.charCodeAt(offset)
  if(firstChar !== 0x3E /* > */) return false

  const blockquoteToken = new Token({
    type: rule.ruleName,
    tag: 'blockquote'
  })
  
  const lines = state.lines
  const lineMarks: number[] = []
  let curLine = line
  while (curLine < lines) {
    const { text, empty, indent, offset, length } = curLine === line ? lineMeta : state.getLineMeta(curLine)
    if(empty || indent >= 4) break
    if(text.charCodeAt(offset) !== firstChar) break
    
    // 计算 > 字符的数量
    let curLineMarkCount = 1
    let pos = offset+1
    while (pos < length) {
      const charCode = text.charCodeAt(pos++)
      if(charCode !== firstChar) break
      curLineMarkCount++
    }
    lineMarks.push(curLineMarkCount)

    curLine++
  }

  const endLine = curLine // 块结束行

  if (silent) return endLine
  
  // 生成嵌套的token关系
  curLine = line
  let idx = 0
  let parentToken = blockquoteToken
  while(curLine < endLine) {
    const curLineMarkCount = lineMarks[idx]
    // 找出下一个标记字符数量大于当前标记字符数量的行
    let nextMoreMarkCountLine = lineMarks.findIndex((count, i) => count > curLineMarkCount && i > idx)

    // 如果不存在大于当前标记字符数量的行，直接设为结束行
    if (nextMoreMarkCountLine === -1) nextMoreMarkCountLine = lineMarks.length

    // 在当前行到nextMoreMarkCountLine之间的内容都是引用块的内容
    const token = new Token({
      type: RULE_BLOCKQUOTE_CONTENT,
      tag: 'p',
      lines: [curLine, line + nextMoreMarkCountLine -1],
      content: state.getRangeMetas(curLine, line + nextMoreMarkCountLine - 1).map((meta,i) => trim(meta.text.slice(meta.offset+lineMarks[idx+i])))
    })
    state.pushToken(token, parentToken)

    curLine = line + nextMoreMarkCountLine
    idx = nextMoreMarkCountLine
    
    // 如果循环未结束，表示有嵌套引用块
    if(curLine < endLine) {
      const blockToken = new Token({
        type: RULE_BLOCKQUOTE_BLOCK,
        tag: 'blockquote',
      })
      state.pushToken(blockToken, parentToken)
      parentToken = blockToken
    }

  }

  blockquoteToken.lines = [line, endLine-1]
  state.pushToken(blockquoteToken)

  return endLine
}

rule.ruleName = RULE_BLOCKQUOTE_BLOCK

export default rule