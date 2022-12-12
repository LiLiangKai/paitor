import State from './state'
import Renderer from './renderer'
import Plugin from './plugin'
import { proxyObject } from '../utils'
import type { TCoreOption, TPCore } from '../types'

export default class Core {
  readonly option: TCoreOption
  state: State
  renderer: Renderer
  plugin: Plugin

  constructor(option: TCoreOption) {
    this.option = option
    const core = proxyCore(this)
    
    this.plugin = new Plugin(option.plugins)
    this.state = new State(core)
    this.renderer = new Renderer(core)

    this.createBlock()
    this.createBlock()
  }

  get editable() {
    return this.option.editable
  }

  get container() {
    return this.option.container
  }

  render() {
    if(!this.container.contains(this.renderer.root)) {
      this.container.appendChild(this.renderer.root)
    }
    this.renderer.focusBlock(this.state.blockFocus)
  }

  createBlock() {
    this.renderer.mountBlock(this.state.createBlock({type: 'paragraph'}))
  }

  deleteBlock(id: string) {
    const block = this.state.getBlock(id)
    if(!block) return
    this.renderer.unmountBlock(block)
    this.state.deleteBlock(id)
  }

  focusBlock(id: string) {
    const block = this.state.getBlock(id)
    const curFocusBlock = this.state.blockFocus
    if(!block || block === curFocusBlock) return
    if(curFocusBlock) {
      this.renderer.blurBlock(curFocusBlock)
    }
    this.state.blockFocus = block
    this.renderer.focusBlock(block)
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

const canVisitFields = [
  'editable', 
  'container', 
  'createBlock', 
  'deleteBlock',
  'focusBlock',
  'getPlugin',
]
function proxyCore(core: Core): TPCore {
  return proxyObject(core, {}, canVisitFields)
}