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

  /* inline token props */
  /** 文本已处理位置 */
  pos: number
  /** 文本边界范围 */
  range: [number, number]
  /** 文本长度 */
  length: number


  /* reference token props */
  /** 链接定义的文本内容 */
  label?: string
  /** 链接定义的链接地址 */
  url?: string
  /** 链接定义的title */
  title?: string

}

class Token implements IToken {
  type: string
  tag: string
  level: number
  attrs: Record<string, string>
  children: Token[]
  content: string[]
  lines: [number, number]
  src: string

  pos: number
  range: [number, number]
  length: number

  label?: string | undefined
  url?: string | undefined
  title?: string | undefined

  constructor(option: Partial<IToken>) {
    for(const key in option) {
      this[key] = option[key]
    }
  }
}

export default Token