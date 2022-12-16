import { proxyObject } from '../../utils'
import type { TCore, TPCore, TBlock, TPBlock } from '../../types'

const blockCanVisitFields = ['id', 'type', 'element', 'data', 'before', 'after', 'change']
export function proxyBlock(block: TBlock): TPBlock {
  return proxyObject(block, {}, blockCanVisitFields)
}

const coreCanVisitFields = [
  'editable',
  'container',
  'blockSize',
  'createBlock',
  'deleteBlock',
  'focusBlock',
  'getPlugin',
]
export function proxyCore(core: TCore): TPCore {
  return proxyObject(core, {}, coreCanVisitFields)
}