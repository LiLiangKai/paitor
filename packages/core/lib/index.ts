import ParserBlock from "./parser/block"
import ParserInline from "./parser/inline"
import State from "./state"
import Renderer from "./render"

class Paitor {
  block: ParserBlock
  inline: ParserInline
  renderer: Renderer
  
  constructor() {
    this.block = new ParserBlock()
    this.inline = new ParserInline()
    this.renderer = new Renderer()
  }

  parse(src: string) {
    if(!src) {
      throw new Error('Parse content is empty!')
    }
    const state = new State(src)
    state.process(this)
    console.log(state)
    return state.tokens
  }

  render(src: string) {
    return this.renderer.render(this.parse(src))
  }
}

window['Paitor'] = Paitor

export default Paitor
