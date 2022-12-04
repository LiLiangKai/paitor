import type { TRuleFn } from '../type'

interface IRule {
  name: string
  fn: Function
  enabled: boolean
  terminators?: string[]
}

class Rule {
  rules: IRule[] = []
  cache: Record<string, Function[]> | null

  setCache() {
    const chains: any[] = [['']]
    const cache = {}
    this.rules.forEach(rule => {
      if(!rule.enabled) return
      if (rule.terminators && rule.terminators.length > 0) {
        chains.push([rule.name, rule.terminators])
      }
    })
    chains.forEach(chain => {
      const [chainName, terminators] = chain
      cache[chainName] = []
      this.rules.forEach(rule => {
        if (!terminators || terminators.includes(rule.name)) {
          cache[chainName].push(rule.fn)
        }
      })
    })
    this.cache = cache
  }

  push(fn: TRuleFn) {
    this.rules.push({
      name: fn.ruleName,
      fn,
      enabled: true,
      terminators: fn.terminators
    })
    this.cache = null
  }

  getRules(chainName = '') {
    if(!this.cache) {
      this.setCache()
    }
    // @ts-ignore
    return this.cache[chainName] as TRuleFn[]
  }
}

export default Rule