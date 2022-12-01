import type { State } from '../type'

class ParserInline {
  parse(state: State) {
    console.log(state.metas)
  }
}

export default ParserInline