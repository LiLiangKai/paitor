import type TBlock from '../core/block'

export type TBlockMetaData<T extends object = any > = T
export type TBlockMeta<T = TBlockMetaData> = {
  id?: string
  type: string
  data?: T
}
export type TPBlock = Pick<TBlock, 'after'|'before'|'id'|'type'|'data'|'element'|'change'>
export { TBlock }