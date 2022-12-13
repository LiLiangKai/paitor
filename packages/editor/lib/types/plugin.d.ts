import { TPBlock, TBlockMetaData } from './block'
import { TPCore } from './core'

export interface IEditorPluginApi<D = TBlockMetaData> {
  readonly block: TPBlock<D>
  readonly core: TPCore
}

export class IEditorPlugin<E extends HTMLElement = HTMLElement, D = TBlockMetaData> {
  readonly paitor: IEditorPluginApi<D>
  input: E

  constructor(instance: IEditorPlugin<E, D>)
  validData(): void
  mount(): void
  unmount(): void
  focus(): void
  blur(): void
  static type: string
}

export type TEditorPluginClass = typeof IEditorPlugin