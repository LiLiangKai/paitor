class LinkNode<T = any> {
  key: string
  weight: number
  data: T
  prev?: LinkNode
  next?: LinkNode

  constructor(key: string, data: T, weight?: number) {
    this.key = key
    this.data = data
    this.weight = weight || 1
  }

  // 将当前节点的next指针指向另一个节点
  linkNext(next?: LinkNode<T>) {
    this.next = next
    next && (next.prev = this)
  }

  // 将当前节点插入到另一个节点后面
  insertAfter(prev?: LinkNode<T>) {
    if(!prev) return
    const next = prev.next
    prev.linkNext(this)
    next && this.linkNext(next)
  }

  unlink() {
    const prev = this.prev
    const next = this.next
    if(!prev) {
      return false
    }
    prev.linkNext(next)
    return true
  }
}

/**
 * 最近最少使用缓存算法
 */
export default class LFU<T = any> {
  limit: number
  headNode: LinkNode
  tailNode: LinkNode
  nodeMemo: Record<string, LinkNode<T>>
  nodeLength: number

  constructor(limit = 500) {
    this.limit = limit
    this.nodeLength = 0
    this.nodeMemo = {}
    this.headNode = new LinkNode('__head__', null, Number.MAX_VALUE)
    this.tailNode = new LinkNode('__tail__', null, Number.MIN_VALUE)
    this.headNode.linkNext(this.tailNode)
  }

  has(key: string) {
    return !!this.nodeMemo[key]
  }

  getData(key: string) {
    const node = this.nodeMemo[key]
    if(!node) return null
    this.addNodeWeight(node)
    return node.data
  }

  set(key: string, data: T) {
    const node = this.nodeMemo[key]
    if(node) {
      this.addNodeWeight(node)
      node.data = data
    } else {
      if(this.nodeLength < this.limit) {
        this.nodeLength++
      } else {
        let deleteNode = this.tailNode.prev
        if(deleteNode) {
          deleteNode.unlink()
          delete this.nodeMemo[deleteNode.key]
          // @ts-ignore
          deleteNode = null
        }
      }
      const node = new LinkNode(key, data, 1)
      this.nodeMemo[node.key] = node
      node.insertAfter(this.tailNode.prev)
    }
  }

  getNodeWeight(key: string) {
    const node = this.nodeMemo[key]
    if (!node) return null
    return node.weight
  }

  addNodeWeight(node: LinkNode<T>, weight=1) {
    let prev = node.prev
    node.unlink()
    node.weight += weight
    while(prev) {
      if(prev.weight <= node.weight) {
        prev = prev.prev
      } else {
        node.insertAfter(prev)
        // @ts-ignore
        prev = null
      }
    }
  }
}