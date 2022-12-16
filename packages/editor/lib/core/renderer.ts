import $ from '../components/dom'
import { prefixCls } from '../constants'
import BlockView from './block-view'
import { TCore, TBlock } from '../types'

export default class Renderer {
  private core: TCore
  private blockMap: WeakMap<TBlock, BlockView>

  root: HTMLDivElement
  contentWrap: HTMLDivElement

  constructor(core: TCore) {
    this.core = core
    this.blockMap = new WeakMap()
    this.root = $.create('div', { class: prefixCls })
    this.contentWrap = $.create('div', { class: `${prefixCls}-content` })
    $.append(this.root, this.contentWrap)
  }

  mountBlock(block: TBlock) {
    if(this.blockMap.has(block)) return
    const view = new BlockView(block, this.core)
    this.contentWrap.appendChild(block.element)
    view.mount()
    this.blockMap.set(block, view)
  }

  unmountBlock(block: TBlock) {
    const view = this.blockMap.get(block)
    if (!view) return
    this.blockMap.delete(block)
    view.unmount()
  }

  focusBlock(block?: TBlock) {
    if(!block) return
    const view = this.blockMap.get(block)
    if(view) {
      view.focus()
    }
  }

  blurBlock(block?: TBlock) {
    if(!block) return
    const view = this.blockMap.get(block)
    if (view) {
      view.blur()
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
