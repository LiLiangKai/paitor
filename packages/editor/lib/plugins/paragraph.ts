import PluginBase from '../core/helper/plugin-base'
import $ from '../components/dom'
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
    this.input.innerHTML = this.paitor.current.data?.text || ''
  }
  
  validData() {
    
  }

  mount(): void {
    const keydownDestory = $.addEventListener(this.input, 'keydown', (e: KeyboardEvent) => {
      switch(e.keyCode) {
        case KEY_CODES.backspace:
          console.log('backspace', this.paitor.current.data.text)
          if(this.empty()) {
            this.paitor.deleteBlock(this.paitor.current.id)
          }
          this
          break;
        case KEY_CODES.enter:
          this.paitor.createBlock()
          e.preventDefault()
          break
        case KEY_CODES.tab:
          console.log('tab')
          break
      }
    })
    const keyupDestory = $.addEventListener(this.input, 'input', (e: KeyboardEvent) => {
      this.paitor.current.change({text: this.input.innerHTML})
      this.paitor
    }, 200)
    this.destory = () => {
      keydownDestory()
      keyupDestory()
    }
  }

  unmount(): void {
    this.destory?.()
  }

  focus(): void {
    this.input.focus()
  }

  blur(): void {
    this.input.blur()
  }

  empty(): boolean {
    return !this.paitor.current.data.text
  }

  static type = 'paragraph'
}