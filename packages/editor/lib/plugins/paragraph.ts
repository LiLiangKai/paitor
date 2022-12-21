import PluginBase from '../core/helper/plugin-base'
import $ from '../components/dom'
import SelectionTool from '../components/selection'
import { prefixCls, KEY_CODES } from '../constants'
import { TPaitorInjectApi, IEditorPlugin } from '../types'

interface IParagraphBlockData {
  text: string
}

export default class Paragraph extends PluginBase implements IEditorPlugin<HTMLDivElement, IParagraphBlockData> {
  readonly paitor: TPaitorInjectApi<IParagraphBlockData>
  input: HTMLDivElement

  destory
  
  constructor(instance) {
    super(instance)
    this.input = $.create('div', { 
      class: `${prefixCls}-paragraph`,
      contenteditable: true,
      tabIndex: 1
    })
    this.input.textContent = this.paitor.current.data?.text || ''
  }
  
  validData() {
    
  }

  mount(): void {
    const keydownDestory = $.addEventListener(this.input, 'keydown', (e: KeyboardEvent) => {
      switch(e.keyCode) {
        case KEY_CODES.backspace:
          if($.isEmptyNode(this.input)) {
            this.paitor.deleteBlock(this.paitor.current.id)
          }
          break;
        case KEY_CODES.enter:
          const range = SelectionTool.getRange()
          const meta = { type: 'paragraph', data: {text:''} }
          if(range) {
            const { startOffset, commonAncestorContainer } = range
            const textContent = commonAncestorContainer.textContent
            if(textContent) {
              commonAncestorContainer.textContent = textContent.slice(0, startOffset)
              meta.data.text = textContent.slice(startOffset)
            }
          }
          this.paitor.createBlock(meta, this.paitor.current.id)
          e.preventDefault()
          break
        case KEY_CODES.tab:
          console.log('tab')
          break
      }
    })
    // const keyupDestory = $.addEventListener(this.input, 'input', (e: KeyboardEvent) => {
    //   this.paitor.current.change({text: this.input.innerHTML})
    //   this.paitor
    // }, 200)
    this.destory = () => {
      keydownDestory()
      // keyupDestory()
    }
  }

  unmount(): void {
    this.destory?.()
  }

  static type = 'paragraph'
}