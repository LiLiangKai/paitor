import { RULE_BLOCKQUOTE_BLOCK, RULE_BLOCKQUOTE_CONTENT } from '../rules/block/ruleName'
import { escapeHtml } from '../utils'
import type { IToken } from '../type'

const defaultRuleRender = {
  'blockquote_content': (token: IToken) => {
    const { tag, content } = token
    return `<${tag}>${content.join('\n')}</${tag}>`
  },
  'blockquote_block': (token: IToken, renderer: Renderer) => {
    const { tag, children } = token
    const content = renderer.render(children)
    return `<${tag}>${content}</${tag}>`
  },
  'code_block': (token: IToken) => {
    return `<pre><code>${escapeHtml(token.content.join('\n'))}</code></pre>\n`
  },
  'fence': (token, renderer: Renderer) => {
    return `<pre><code${renderer.renderAttr(token)}>${escapeHtml(token.content.join('\n'))}</code></pre>\n`
  },
  'heading': (token: IToken) => {
    const { tag, content } = token
    return `<${tag}>${content.join('\n')}</${tag}>\n`
  },
  'lheading': (token: IToken) => {
    const { tag, content } = token
    return `<${tag}>${content.join('\n')}</${tag}>\n`
  },
  'hr': (token: IToken) => {
    return `<${token.tag}>\n`
  },
  'paragraph': (token: IToken) => {
    return `<p>${token.content.join('\n')}</p>\n`
  }
}

class Renderer {
  rules: Record<keyof typeof defaultRuleRender, Function>

  constructor(rules?: Record<keyof typeof defaultRuleRender, Function>) {
    this.rules = Object.assign({}, defaultRuleRender, rules || {})
  }

  renderAttr(token: IToken) {
    const { attrs } = token
    let result = ''
    if(!attrs) return result
    Object.keys(attrs).map(key => {
      result += ` ${key}=${attrs[key]}`
    })
    return result
  }

  render(tokens: IToken[]) {
    let result = ''
    for(let i=0; i<tokens.length; i++) {
      const token = tokens[i]
      if(this.rules[token.type]) {
        result += this.rules[token.type](token, this)
      }
    }
    return result
  }
}

export default Renderer