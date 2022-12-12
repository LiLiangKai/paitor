import $ from '../utils/dom'
import { prefixCls } from '../constants'
import { TPBlock, TPCore, IEditorPlugin } from '../types'

export default class Plugin implements IEditorPlugin {
  block: TPBlock
  core: TPCore
  input: HTMLDivElement

  constructor(block: TPBlock, core: TPCore) {
    this.block = block
    this.core = core
  }

  mount() {
    if(!this.input) return
    this.block.element.appendChild(this.input)
  }

  unmount() {
    if(!this.input) return
    this.input.remove()
  }

  focus() {
    this.core.focusBlock(this.block.id)
    $.updateClassName(this.input).add(`${prefixCls}-active`)
    this.input.focus()
  }

  blur() {
    $.updateClassName(this.input).remove(`${prefixCls}-active`)
    this.input.blur()
  }

  validData(): void {}
}