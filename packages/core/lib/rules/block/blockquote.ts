import Token from '../../state/token'
import { trim } from '../../utils'
import { 
  RULE_BLOCKQUOTE, 
  RULE_BLOCKQUOTE_BLOCK,
  RULE_BLOCKQUOTE_CONTENT,
} from './ruleName'
import type { State, Paitor, TLineMeta } from '../../type'

/**
 * 引用块
 * 以 > 字符为起始的行
 * 
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

  const endLine = curLine

  if (silent) return endLine
  
  curLine = line
  let idx = 0
  let parentToken = blockquoteToken
  while(curLine < endLine) {
    const curLineMarkCount = lineMarks[idx]
    let nextMoreMarkCountLine = lineMarks.findIndex((count, i) => count > curLineMarkCount && i > idx)

    if (nextMoreMarkCountLine === -1) nextMoreMarkCountLine = lineMarks.length

    const token = new Token({
      type: RULE_BLOCKQUOTE_CONTENT,
      tag: 'p',
      lines: [curLine, line + nextMoreMarkCountLine -1],
      content: state.getRangeMetas(curLine, line + nextMoreMarkCountLine - 1).map((meta,i) => trim(meta.text.slice(meta.offset+lineMarks[idx+i])))
    })
    state.pushToken(token, parentToken)

    curLine = line + nextMoreMarkCountLine
    idx = nextMoreMarkCountLine
    
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