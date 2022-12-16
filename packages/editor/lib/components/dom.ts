import { debounce } from '../utils'

interface IDOMChildren {
  tag: string
  attrs?: Record<string, any>
  children?: IDOMChildren[]
}

class DOM {
  static create<E extends HTMLElement = HTMLElement>(
    tag: string, 
    attrs?: Record<string, any>, 
    children?: IDOMChildren[]
  ) {
    const dom = document.createElement(tag)
    if(attrs) {
      DOM.updateAttributes(dom, attrs)
    }
    if(children && children.length) {
      for(let i=0; i<children.length; i++) {
        const child = children[i]
        dom.appendChild(DOM.create(child.tag, child.attrs, child.children))
      }
    }
    return dom as E
  }

  static updateAttributes<E extends HTMLElement = HTMLElement>(element: E, attrs: Record<string, any>) {
    for(const key in attrs) {
      const value = attrs[key]
      if (key === 'class') {
        element.classList.add(value)
      } else {
        element.setAttribute(key, value)
      }
    }
  }

  static updateClassName<E extends HTMLElement = HTMLElement>(element: E) {
    return {
      add(...classNames: string[]) {
        element.classList.add(...classNames)
      },
      contains(className: string) {
        element.classList.contains(className)
      },
      remove(...classNames: string[]) {
        element.classList.remove(...classNames)
      }
    }
  }

  static querySelector<E extends HTMLElement = HTMLElement>(selector: string, parentDom: E) {
    return (parentDom || document).querySelector<E>(selector)
  }

  static append<P extends HTMLElement = HTMLDivElement, E extends HTMLElement = HTMLDivElement>(parent: P, child: E){ 
    parent.appendChild(child)
  }

  static addEventListener(
    dom: HTMLElement, 
    event: string, 
    handle: EventListenerOrEventListenerObject,
    debounceDelay = 0
  ) {
    let eventHandle = handle
    if (debounceDelay > 0) {
      eventHandle = debounce(handle, debounceDelay)
    }

    dom.addEventListener(event, eventHandle, false)
    return () => {
      dom.removeEventListener(event, eventHandle, false)
    }
  }

  static keyCodeMap = {
    13: 'enter',
    12: 'space'
  }
}

export default DOM