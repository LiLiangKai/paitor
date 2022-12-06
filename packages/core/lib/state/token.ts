export interface IToken {
  /**
   * token类型，与规则同名，如 heading、paragraph
   */
  type: string
  /**
   * token对应的标签类型
   */
  tag: string
  /**
   * 等级，如heading的 1~6等级
   */
  level: number
  /**
   * 标签的额外属性
   */
  attrs: Record<string, string>
  /**
   * 块内容中包含的内联内容tokens
   */
  children: Token[]
  /**
   * 内容
   */
  content: (string | string[])[]
  /**
   * 包含的行起始和行结束
   */
  lines: [number, number]
  /** 对应的源文本内容 */
  src: string

  /* reference token props */
  /** 链接定义的文本内容 */
  label?: string
  /** 链接定义的链接地址 */
  url?: string
  /** 链接定义的title */
  title?: string

}

export interface IInlineToken extends IToken {
  /** 文本已处理位置 */
  pos: number
  /** 文本长度 */
  length: number
  /** 标记栈 */
  markStack: string[]
}

class Token implements IToken {
  type: string
  tag: string
  level: number
  attrs: Record<string, string>
  children: Token[]
  content: (string | string[])[]
  lines: [number, number]
  src: string

  label?: string | undefined
  url?: string | undefined
  title?: string | undefined

  constructor(option: Partial<IToken>) {
    for(const key in option) {
      this[key] = option[key]
    }
  }
}

export class InlineToken extends Token implements IInlineToken {
  pos: number
  length: number
  markStack: string[]

  constructor(option) {
    super(option)
    this.content = []
    this.markStack = []
    this.pos = 0
    this.length = this.src.length
  }

  inlineEndParsed() {
    return this.pos >= this.length
  }

  pushContent(text: string) {
    const lastContentBlockIdx = this.content.length - 1
    if (Array.isArray(this.content[lastContentBlockIdx])) {
      (this.content[lastContentBlockIdx] as string[]).push(text)
    } else {
      this.content.push([text])
    }
  }

  pushTypeContent(type: string, text?: string) {
    if(!text) {
      this.content.push(type)
      return
    }
    this.content.push(
      type,
      [text],
      type
    )
  }

  markStackPush(mark: string) {
    this.markStack.push(mark)
  }

  markStackPop() {
    return this.markStack.pop()
  }

  // 判断栈顶是否有相同的标记
  hasSameMarkInStackTop(mark: string) {
    return this.markStack[this.markStack.length-1] === mark
  }
}

export default Token