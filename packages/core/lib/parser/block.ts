import Rule from '../state/rule'
import blockRules from '../rules/block'
import type { State, Paitor } from '../type'

class ParserBlock {
  ruler: Rule

  constructor() {
    this.ruler = new Rule()
    blockRules.forEach(rule => {
      this.ruler.push(rule)
    })
  }

  parse(state: State, paitor: Paitor) {
    const rules = this.ruler.getRules
    ()
    const metas = state.metas
    const lines = state.lines
    let line = state.skipEmptyLines(0)
    
    while(line < lines) {
      const meta = metas[line]
      
      for(let i=0; i<rules.length; i++) {
        const nextLine = rules[i](meta, state, paitor)
        if(typeof nextLine === 'number') {
          // 返回数值，表示此行满足当前解析规则，已被解析，返回结果为下一个需要解析的行
          line = state.skipEmptyLines(nextLine)
          break
        }
      }

      if(line === meta.line) {
        line = state.skipEmptyLines(line+1)
      }
    }
  }
}

export default ParserBlock