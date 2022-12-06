import Rule from '../state/rule'
import Token, { InlineToken } from '../state/token'
import inlineRules, { RULE_INLINE } from '../rules/inline'
import { LFU } from '../utils'
import type { State, Paitor, IToken } from '../type'

class ParserInline {
  ruler: Rule
  lfu: LFU<{content:any; pos:number}>

  constructor() {
    this.ruler = new Rule()
    inlineRules.forEach(rule => {
      this.ruler.push(rule)
    })
    this.lfu = new LFU()
  }

  parse(state: State, paitor: Paitor) {
    const tokens = state.tokens
    for(let i=0; i<tokens.length; i++) {
      const token = tokens[i]
      const { children = [] } = token
      if(!children.length) {
        this.parseToken(token, state, paitor)
      } else {

      }
    }
  }

  parseToken(token: Token, state: State, paitor: Paitor) {
    const rules = this.ruler.getRules()
    const inlineToken = createInlineToken(token)
    const src = inlineToken.src
    const cache = this.lfu.getData(src)
    if(cache) {
      inlineToken.content = cache.content
      inlineToken.pos = cache.pos
    } else {
      while(!inlineToken.inlineEndParsed()) {
        for(let i=0; i<rules.length; i++) {
          const ok = rules[i](inlineToken, state, paitor)
          if(ok) break
        }
      }
      this.lfu.set(src, {
        content: inlineToken.content,
        pos: inlineToken.pos
      })
    }
    state.pushToken(inlineToken, token)
  }
}

export default ParserInline

function createInlineToken(token: IToken) {
  const { content } = token
  const src = content.join('\n')
  return new InlineToken({
    type: RULE_INLINE,
    src,
  })
}