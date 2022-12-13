import PluginBase from '../core/helper/plugin-tool'
import $ from '../components/dom'
import { prefixCls } from '../constants'
import { IEditorPluginApi, IEditorPlugin } from '../types'

interface IParagraphBlockData {
  text: string
}

export default class Paragraph extends PluginBase implements IEditorPlugin<HTMLDivElement, IParagraphBlockData> {
  readonly paitor: IEditorPluginApi<IParagraphBlockData>
  input: HTMLDivElement
  
  constructor(instance) {
    super(instance)
    this.input = $.create('div', { 
      class: `${prefixCls}-paragraph`,
      contenteditable: true,
      tabIndex: 1
    })
  }
  
  validData() {
    
  }

  mount(): void {
    
  }

  unmount(): void {

  }

  focus(): void {
    this.input.focus()
  }

  blur(): void {
    this.input.blur()
  }

  static type = 'paragraph'
}