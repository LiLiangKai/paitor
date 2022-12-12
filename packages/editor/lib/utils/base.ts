export function uid() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(-6)}`
}

export function debounce(fn, delay = 100) {
  let timer 
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      typeof fn === 'function' && fn(...args)
    }, delay)
  }
}

export function proxyObject<T extends object = any, O = T>(target: T, handler: any, canVisitFields?: string[]): T {
  return new Proxy(target, {
    set(...arg) {
      if(handler.set) {
        return handler.set(...arg)
      }
      return false
    },
    get(target, key: string, ...arg) {
      if(handler.get) {
        return handler.get(target, key, ...arg)
      }
      let value
      if (canVisitFields && !canVisitFields.includes(key)) {
        return undefined
      }
      value = target[key]
      if(typeof value === 'function') {
        value = value.bind(target)
      }
      return value
    }
  })
}