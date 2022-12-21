import $ from './dom'

export default class SelectionTool {
  static get() {
    return window.getSelection() as Selection
  }

  static get text() {
    return SelectionTool.get().toString() || ''
  }

  static get anchorNode() {
    const selection = SelectionTool.get()
    return selection?.anchorNode || null
  }

  static get anchorElement() {
    const anchorNode = SelectionTool.anchorNode
    if (!anchorNode) return null
    if($.isElement(anchorNode)) return anchorNode
    return anchorNode.parentElement
  }

  static get anchorOffset() {
    const selection = SelectionTool.get()
    return selection?.anchorOffset || null
  }

  static get isCollapsed() {
    const selection = SelectionTool.get()
    return selection?.isCollapsed || null
  }

  static getRange() {
    const selection = SelectionTool.get()
    return selection && selection.rangeCount ? selection.getRangeAt(0) : null
  }

  static setCursor(element: HTMLElement, offset = 0) {
    const range = document.createRange()
    const selection = SelectionTool.get()

    if ($.isNativeInput(element) || !selection) {
      element.focus()
      // @ts-ignore
      element.selectionStart = element.selectionEnd = offset
      return element.getBoundingClientRect()
    }
    
    range.setStart(element, offset)
    range.setEnd(element, offset)
    selection.removeAllRanges()
    selection.addRange(range)
    return range.getBoundingClientRect()
  }
}
