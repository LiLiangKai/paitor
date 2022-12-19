import { debounce } from '../utils'
import { DOM_CONST } from '../constants'

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

  static getDeepestNode(node: Node, atLast = true) {
    if(!node) return node

    const child = atLast ? 'lastChild' : 'firstChild'
    const sibling = atLast ? 'previousSibling' : 'nextSibling'
    
    if(node.nodeType === Node.ELEMENT_NODE && node[child]) {
      let nodeChild = node[child] as Node
      if(
        DOM.isSingleTag(nodeChild as HTMLElement) &&
        !DOM.isNativeInput(nodeChild as HTMLElement) &&
        !DOM.isLineBreakTag(nodeChild as HTMLElement)
      ) {
        if(nodeChild[sibling]) {
          nodeChild = nodeChild[sibling] as Node
        } else if(nodeChild.parentNode?.[sibling]) {
          nodeChild = nodeChild.parentNode[sibling] as Node
        } else {
          return nodeChild.parentNode
        }
      }
      return DOM.getDeepestNode(nodeChild, atLast)
    }
    return node
  }

  static getContentLength(node: Node) {
    if(DOM.isNativeInput(node as HTMLElement)) {
      return (node as HTMLInputElement).value.length
    }
    return node.textContent?.length || 0
  }

  static isNativeInput(element: HTMLElement) {
    return element && element.tagName ? DOM_CONST.nativeInputs.includes(element.tagName) : false
  }

  static isLineBreakTag(element: HTMLElement) {
    return element && DOM_CONST.lineBreakTags.includes(element.tagName)
  }

  static isSingleTag(element: HTMLElement) {
    return element && DOM_CONST.singleTags.includes(element.tagName)
  }

  static isElement(node) {
    if(!node || typeof node !== 'object') return false
    return node.nodeType && node.nodeType === Node.ELEMENT_NODE
  }

  static isEmptyNode(node: Node) {
    let text = ''
    if(
      DOM.isSingleTag(node as HTMLElement) &&
      !DOM.isLineBreakTag(node as HTMLElement)
    ) {
      return false
    }
    if(DOM.isElement(node) && this.isNativeInput(node as HTMLElement)) {
      text = (node as HTMLInputElement).value
    } else {
      text = node.textContent || ''
    }
    return text.trim().length === 0
  }
}

export default DOM