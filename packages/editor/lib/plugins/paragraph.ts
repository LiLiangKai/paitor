import Plugin from './base'
import $ from '../utils/dom'
import { prefixCls } from '../constants'
import { TPBlock, TPCore, IEditorPlugin } from '../types'

export default class Paragraph extends Plugin implements IEditorPlugin {
  
  constructor(block: TPBlock, core: TPCore) {
    super(block, core)
    this.input = $.create('div', { 
      class: `${prefixCls}-paragraph`,
      contenteditable: true,
      tabIndex: 1
    })
  }

  validData() {
    
  }

  static type = 'paragraph'
}