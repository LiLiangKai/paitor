import Rule from '../state/rule'
import Token from '../state/token'
import inlineRules, { RULE_INLINE, pushContent } from '../rules/inline'
import type { State, Paitor, IToken } from '../type'

class ParserInline {
  ruler: Rule

  constructor() {
    this.ruler = new Rule()
    inlineRules.forEach(rule => {
      this.ruler.push(rule)
    })
  }

  parse(state: State, paitor: Paitor) {
    const tokens = state.tokens
    const rules = this.ruler.getRules()

    for(let i=0; i<tokens.length; i++) {
      const token = tokens[i]
      const { children = [] } = token
      if(!children.length) {
        const inlineToken = createInlineToken(token)
        for(let r=0; r<rules.length; r++) {
          rules[r](inlineToken, state, paitor)
          if(inlineEndParsed(inlineToken)) break
        }
        if(!inlineEndParsed(inlineToken)) {
          pushContent(inlineToken.content, inlineToken.src.slice(inlineToken.pos))
          inlineToken.pos = inlineToken.length
        }
        state.pushToken(inlineToken, token)
      } else {

      }
    }
  }
}

export default ParserInline

function createInlineToken(token: IToken) {
  const { content } = token
  const src = content.join('\n')
  return new Token({
    type: RULE_INLINE,
    src,
    length: src.length,
    content: [],
    pos: 0,
    range: [0, src.length-1]
  })
}

function inlineEndParsed(token: IToken) {
  return token.pos >= token.length
}