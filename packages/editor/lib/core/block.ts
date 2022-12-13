import { uid } from '../utils'
import $ from '../components/dom'
import { prefixCls, HEADER_BLOCK_ID, TAIL_BLOCK_ID } from '../constants'
import type { TBlockMetaData, TBlockMeta } from '../types'

export default class Block<D = TBlockMetaData> {
  readonly id: string
  readonly type: string
  readonly element: HTMLDivElement

  data: D
  nextSibling: Block<any>
  prevSibling: Block<any>

  constructor(data?: TBlockMeta) {
    this.id = data?.id || uid()
    this.type = data?.type || 'paragraph'
    this.data = data?.data || {}
    this.element = $.create('div', { class: `${prefixCls}-block` })
  }

  get before() {
    const prevSibling = this.prevSibling
    if (prevSibling.id === HEADER_BLOCK_ID) return null
    return {
      id: prevSibling.id,
      type: prevSibling.type,
    }
  }

  get after() {
    const nextSibling = this.nextSibling
    if (nextSibling.id === TAIL_BLOCK_ID) return null
    return {
      id: nextSibling.id,
      type: nextSibling.type,
    }
  }

  change(data: D): void {
    this.data = data
  }

  /** insert other block before this block */
  insertBefore<D = TBlockMetaData>(block: Block<D>) {
    if (this.prevSibling) {
      this.prevSibling.nextSibling = block
    }
    block.prevSibling = this.prevSibling
    this.prevSibling = block
    block.nextSibling = this
  }

  /** insert other block after this block */
  insertAfter<D = TBlockMetaData>(block: Block<D>) {
    if (this.nextSibling) {
      this.nextSibling.prevSibling = block
    }
    block.nextSibling = this.nextSibling
    this.nextSibling = block
    block.prevSibling = this
  }

  unlink(): void {
    if (!this.prevSibling && !this.nextSibling) {
      throw new Error('Can not unlink block which no prevSibling and nextSibling')
    }
    if (this.prevSibling) {
      this.prevSibling.insertAfter(this.nextSibling)
    }
    if (this.nextSibling) {
      this.nextSibling.insertBefore(this.prevSibling)
    }
    this.nextSibling = null as any
    this.prevSibling = null as any
  }

  destory(): void {

  }
}