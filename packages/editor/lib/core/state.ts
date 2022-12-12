import Block from './block'
import { HEADER_BLOCK_ID, TAIL_BLOCK_ID } from '../constants'
import type { TPCore, TBlockMeta, TBlockMetaData } from '../types'

export default class State {

  private blockHeader: Block
  private blockTail: Block
  private blockSize: number
  private blockMap: Map<string, Block>
  blockFocus: Block

  constructor(core: TPCore) {

    this.blockMap = new Map()
    this.blockSize = 0
    this.blockHeader = new Block({
      id: HEADER_BLOCK_ID, 
      type: HEADER_BLOCK_ID, 
      data: {}
    })
    this.blockTail = new Block({
      id: TAIL_BLOCK_ID,
      type: TAIL_BLOCK_ID,
      data: {}
    })
    this.blockHeader.insertAfter(this.blockTail)
  }

  createBlock<D = TBlockMetaData>(meta: TBlockMeta<D>, prevBlockId?: string) {
    const block = new Block<D>(meta)
    const prevBlock = this.blockMap.get(prevBlockId || '')
    if(prevBlock) {
      prevBlock.insertAfter(block)
    } else {
      this.blockTail.insertBefore(block)
    }
    this.blockSize++
    this.blockMap.set(block.id, block)
    this.blockFocus = block
    return block
  }

  deleteBlock(id: string) {
    if(this.blockSize <= 1) return
    if(!this.blockMap.has(id)) return
    let block = this.blockMap.get(id) as Block

    // 转转blockFoucs对象
    let nextFocusBlock = block.nextSibling
    if (nextFocusBlock === this.blockTail) {
      nextFocusBlock = block.prevSibling
    }
    this.blockFocus = nextFocusBlock

    block.unlink()
    this.blockMap.delete(id)
    this.blockSize--
    block = null as any
  }

  getBlock(id: string) {
    return this.blockMap.get(id)
  }

  forEach(cb: (block: Block, index: number) => void) {
    let block = this.blockHeader.nextSibling
    let i = 0
    while (block && i < this.blockSize) {
      typeof cb === 'function' && cb(block, i)
      block = block.nextSibling
      i++
    }
  }
 
  destory() {
    this.blockMap.clear()
    this.blockSize = 0
    this.blockHeader = null as any
    this.blockTail = null as any
    this.blockFocus = null as any
  }
}