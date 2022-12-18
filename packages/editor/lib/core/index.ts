import $ from '../components/dom'
import State from './state'
import Renderer from './renderer'
import Plugin from './plugin'
import type { TCoreOption } from '../types'

export default class Core {
  readonly option: TCoreOption
  state: State
  renderer: Renderer
  plugin: Plugin

  constructor(option: TCoreOption) {
    this.option = option
    
    this.plugin = new Plugin(option.plugins)
    this.state = new State(this)
    this.renderer = new Renderer(this)

    this.createBlock(false)
  }

  get editable() {
    return this.option.editable
  }

  get container() {
    return this.option.container
  }

  get blockSize() {
    return this.state.blockSize
  }

  render() {
    if(!this.container.contains(this.renderer.root)) {
      $.append(this.container, this.renderer.root)
    }
    this.renderer.focusBlock(this.state.blockFocus)
  }

  createBlock(autoFocus: boolean = true) {
    const curFocusBlock = this.state.blockFocus
    const block = this.state.createBlock({ type: 'paragraph' })
    this.renderer.mountBlock(block)
    if(autoFocus) {
      if(curFocusBlock) {
        this.renderer.blurBlock(curFocusBlock)
      }
      this.renderer.focusBlock(block)
    }
  }

  deleteBlock(id: string) {
    if(this.blockSize <= 1) return
    const block = this.state.getBlock(id)
    if(!block) return
    this.renderer.unmountBlock(block)
    this.state.deleteBlock(id)
  }

  focusBlock(id: string) {
    const block = this.state.getBlock(id)
    const blockFocusId = this.state.blockFocusId
    if(!block || id === blockFocusId) return
    if(blockFocusId) {
      this.renderer.blurBlock(this.state.blockFocus)
    }
    this.state.blockFocusId = block.id
    this.renderer.focusBlock(this.state.blockFocus)
  }

  getPlugin(type: string) {
    return this.plugin.getPlugin(type)
  }

  destory() {
    if(!this.state) return
    this.state.forEach((block) => {
      this.renderer.unmountBlock(block)
    })
    this.state.destory()
    this.renderer.destory()
    this.plugin = null as any
    this.state = null as any
    this.renderer = null as any
  }
}
