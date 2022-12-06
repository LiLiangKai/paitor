import { RULE_CODE } from './ruleName'
import Token from '../../state/token'
import type { State, Paitor, TLineMeta } from '../../type'

/**
 * 缩进代码块解析规则
 * 行首缩进至少4个空格时，表示缩进代码块，若下一行也是缩进至少4个空格，则同为代码块内容，直到遇到缩进小于4个空格的行或空行
 * @param {TLineMeta} lineMeta 
 * @param {State} state 
 * @param {Paitor} paitor
 * @param {Boolean} silent
 */
function rule(lineMeta: TLineMeta, state: State, paitor: Paitor, silent = false) {
  const { empty, indent, line } = lineMeta
  
  if(empty) return line+1
  if(indent < 4) return false
  
  // 下一个缩进 >=4 的行，需要包含空行，因为空行的下一行可能满足条件
  const lines = state.lines
  let nextLine = line+1
  while(nextLine < lines) {
    if(state.isEmptyLine(nextLine)) {
      nextLine++
      continue
    }
    const nextMeta = state.getLineMeta(nextLine)
    if(nextMeta.indent < 4) {
      nextLine-- // 当前行不满足条件，退回到上一行
      break
    }
    nextLine++ 
  }

  let nextNoEmptyLine = nextLine
  if(line < nextLine) {
    while(state.isEmptyLine(nextNoEmptyLine)) nextNoEmptyLine--
  }

  if(silent) return true

  const token = new Token({
    type: rule.ruleName,
    tag: 'code',
    lines: [line, nextNoEmptyLine],
    content: state.getRangeMetas(line, nextNoEmptyLine).map(meta => meta.text.slice(4))
  })
  state.pushToken(token)

  return nextLine
}

rule.ruleName = RULE_CODE


export default rule