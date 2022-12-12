import $ from '../utils/dom'
import { prefixCls } from '../constants'
import { proxyBlock } from './block'
import { TPCore, TBlock, IEditorPlugin } from '../types'

export default class Renderer {
  private core: TPCore
  private blockMap: WeakMap<TBlock, IEditorPlugin>

  root: HTMLDivElement
  contentWrap: HTMLDivElement

  constructor(core: TPCore) {
    this.core = core
    this.blockMap = new WeakMap()
    this.root = $.create('div', { class: prefixCls })
    this.contentWrap = $.create('div', { class: `${prefixCls}-content` })
    this.root.appendChild(this.contentWrap)
  }

  mountBlock(block: TBlock) {
    if(this.blockMap.has(block)) return
    const plugin = this.core.getPlugin(block.type)
    if(!plugin) {
      throw new Error(`Not found ${block.type} plugin`)
    }
    this.contentWrap.appendChild(block.element)
    const instance = new plugin(proxyBlock(block), this.core)
    instance.mount()
    this.blockMap.set(block, instance)
  }

  unmountBlock(block: TBlock) {
    const instance = this.blockMap.get(block)
    if (!instance) return
    this.blockMap.delete(block)
    instance.unmount()
  }

  focusBlock(block: TBlock) {
    const instance = this.blockMap.get(block)
    if(instance) {
      instance.focus()
    }
  }

  blurBlock(block: TBlock) {
    const instance = this.blockMap.get(block)
    if (instance) {
      instance.blur()
    }
  }

  destory() {
    if(!this.root) return
    this.root.remove()
    this.blockMap = null as any
    this.root = null as any
    this.contentWrap = null as any
  }
}
