import $ from '../components/dom'
import { prefixCls } from '../constants'
import { proxyBlock, proxyCore } from './helper/proxy'
import { TCore, TBlock, IEditorPlugin } from '../types'

export default class BlockView {
  instance: IEditorPlugin
  block: TBlock
  core: TCore

  private destoryCallback

  constructor(block: TBlock, core: TCore) {
    const plugin = core.getPlugin(block.type)
    if(!plugin) {
      throw new Error(`Not found ${block.type} plugin`)
    }
    this.block = block
    this.core = core
  
    this.instance = Object.create(plugin.prototype)
    // @ts-ignore
    this.instance.paitor = {
      block: proxyBlock(block),
      core: proxyCore(core),
    }
    this.instance = new plugin(this.instance)
  }

  focus() {
    if(!this.instance) return
    this.instance.focus()
    $.updateClassName(this.instance.input).add(`${prefixCls}-active`)
  }

  blur() {
    if(!this.instance) return
    this.instance.blur()
    $.updateClassName(this.instance.input).remove(`${prefixCls}-active`)
  }

  mount() {
    const instance = this.instance
    if(!instance) return
    if(!instance.input) {
      throw new Error(`${this.block.type} plugin uninitialized input element`)
    }
    const element = this.block.element
    const destoryMouseenter = $.addEventListener(element, 'mouseenter', this.handleMouseenter.bind(this))
    const destoryMouseLeave = $.addEventListener(element, 'mouseleave', this.handleMouseleave.bind(this))
    $.append(element, instance.input)
    instance.mount()

    this.destoryCallback = () => {
      destoryMouseenter()
      destoryMouseLeave()
    }
  }

  unmount() {
    this.destoryCallback?.()
    this.instance.unmount()
  }

  handleMouseenter() {
    $.updateClassName(this.block.element).add(`${prefixCls}-block-hover`)
  }

  handleMouseleave() {
    $.updateClassName(this.block.element).remove(`${prefixCls}-block-hover`)
  }
}