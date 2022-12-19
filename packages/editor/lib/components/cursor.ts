import $ from './dom'

export default class Cursor {
  static set(element: HTMLElement, offset = 0): DOMRect {
    const range = document.createRange()
    const selection = window.getSelection() as Selection

    if($.isNativeInput(element)) {
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