import { normalize, isSpace, isTabSpace } from '../utils'
import type { Paitor } from '../type'
import type Token from './token'

export type TLineMeta = {
  /** 行文本 */
  text: string
  /** 长度 */
  length: number
  /** 是否为空行 */
  empty: boolean
  /** 行号 */
  line: number
  /** 该行起始偏移量 */
  start: number
  /** 该行结束偏移量 */
  end: number
  /** 该首个非空字符偏移量 */
  offset: number
  /** 该行缩进数 */
  indent: number
}

export type TLineMetas = TLineMeta[]

class State {
  src: string
  metas: TLineMetas
  tokens: Token[]
  references: Record<string, Token>

  constructor(src: string) {
    this.src = normalize(src)

    const lines = this.src.split('\n')
    let offsets = 0
    this.metas = lines.reduce((metas, line, idx) => {
      const lineMeta = scanLine(line)
      metas.push({
        ...lineMeta,
        line: idx,
        start: offsets,
        end: offsets + lineMeta.length,
      })
      offsets += lineMeta.length + 1
      return metas
    }, [] as TLineMetas)
    
    this.tokens = []
    this.references = {}
  }

  get lines() {
    return this.metas.length
  }

  process(paitor: Paitor) {
    paitor.block.parse(this, paitor)
    return this.tokens
    // paitor.inline.parse(this)
  }

  pushToken(token: Token) {
    this.tokens.push(token)
  }

  pushReferenceToken(token: Token) {
    const label = token.label?.toLocaleLowerCase()
    if(!label) return
    if(this.references[label]) return
    this.references[label] = token
  }

  getLineMeta(line: number) {
    return this.metas[line]
  }

  skipEmptyLines(line: number) {
    let i = line
    while (this.metas[i] && this.metas[i].empty) i++
    return i
  }

  isEmptyLine(line: number) {
    const meta = this.metas[line]
    return !meta || meta.empty
  }

  getRangeMetas(startLine: number, endLine: number) {
    const metas: TLineMetas = []
    for(let i=startLine; i<=endLine && i<this.metas.length; i++) {
      metas.push(this.metas[i])
    }
    return metas
  }
}

export default State

function scanLine(line: string) {
  let isIndent = false, indent = 0, offset = 0
  for(let i=0; i<line.length; i++) {
    const charCode = line.charCodeAt(i)
    if(isIndent) break
    if(isSpace(charCode)) {
      indent++
      if(isTabSpace(charCode)) {
        offset += 4 - offset % 4
      } else {
        offset++
      }
      continue
    } else {
      isIndent = true
    }
    
  }
  return {
    text: line,
    length: line.length,
    empty: !line.trim().length,
    indent,
    offset,
  }
}