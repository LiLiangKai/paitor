import { paitorApi } from './helper/api'
import $ from '../components/dom'
import SelectionTool from '../components/selection'
import { prefixCls } from '../constants'
import { delay } from '../utils'
import { TCore, TBlock, IEditorPlugin } from '../types'

export default class BlockView {
  instance: IEditorPlugin
  block: TBlock
  core: TCore

  private destoryCallback
  private inputWrap: HTMLDivElement

  constructor(block: TBlock, core: TCore) {
    const plugin = core.getPlugin(block.type)
    if(!plugin) {
      throw new Error(`Not found ${block.type} plugin`)
    }
    this.inputWrap = $.create('div', {class: `${prefixCls}-block-content`})
    $.append(block.element, this.inputWrap)
    
    this.block = block
    this.core = core
    this.instance = Object.create(plugin.prototype)
    // @ts-ignore
    this.instance.paitor = paitorApi(block, core)
    this.instance = new plugin(this.instance)
  }

  focus() {
    if(!this.instance) return
    const node = $.getDeepestNode(this.instance.input)
    const contentLength = $.getContentLength(node)
    delay(() => {
      SelectionTool.setCursor(node, contentLength)
    }, 10)()
    $.updateClassName(this.block.element).add(`${prefixCls}-block-active`)
  }

  blur() {
    if(!this.instance) return
    $.updateClassName(this.block.element).remove(`${prefixCls}-block-active`)
  }

  mount() {
    const instance = this.instance
    if(!instance) return
    if(!instance.input) {
      throw new Error(`${this.block.type} plugin uninitialized input element`)
    }
    const element = this.block.element

    const destoryClick = $.addEventListener(element, 'click', this.handleMouseClick.bind(this))
    const destoryMouseenter = $.addEventListener(element, 'mouseenter', this.handleMouseEnter.bind(this))
    const destoryMouseLeave = $.addEventListener(element, 'mouseleave', this.handleMouseLeave.bind(this))

    $.append(this.inputWrap, instance.input)
    instance.mount()

    this.destoryCallback = () => {
      destoryClick()
      destoryMouseenter()
      destoryMouseLeave()
    }
  }

  unmount() {
    this.destoryCallback?.()
    this.instance.unmount()
    this.block.element.remove()
    this.block = null as any
    this.core = null as any
    this.instance = null as any
  }

  handleMouseClick() {
    this.core.focusBlock(this.block.id)
  }

  handleMouseEnter() {
    $.updateClassName(this.block.element).add(`${prefixCls}-block-hover`)
  }

  handleMouseLeave() {
    $.updateClassName(this.block.element).remove(`${prefixCls}-block-hover`)
  }
}