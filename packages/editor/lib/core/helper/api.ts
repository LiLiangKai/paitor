import { proxyObject } from '../../utils'
import type { TCore, TBlock, TBlockMetaData } from '../../types'

export type TPaitorInjectApi<D = TBlockMetaData> = {
  current: TPBlock<D>
  editable(): boolean
  blockSize(): number
  createBlock: TCore['createBlock']
  deleteBlock: TCore['deleteBlock']
  focusBlock: TCore['focusBlock']
}

export function paitorApi<D = TBlockMetaData>(block: TBlock<D>, core: TCore): TPaitorInjectApi<D> {
  return {
    current: proxyBlock<D>(block),
    editable: () => core.editable,
    blockSize: () => core.blockSize,
    createBlock: core.createBlock.bind(core),
    deleteBlock: core.deleteBlock.bind(core),
    focusBlock: core.focusBlock.bind(core),
  }
}

const blockCanVisitFields = ['id', 'type', 'element', 'data', 'before', 'after', 'change']
export function proxyBlock<D = TBlockMetaData>(block: TBlock<D>): TPBlock<D> {
  return proxyObject(block, {}, blockCanVisitFields)
}

export type TPBlock<D = TBlockMetaData> = Pick<TBlock<D>, 'id'|'type'|'element'|'data'|'before'|'after'|'change'>