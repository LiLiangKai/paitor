import { TBlockMetaData } from './block'
import { TPaitorInjectApi } from '../core/helper/api'

export { TPaitorInjectApi }

export class IEditorPlugin<E extends HTMLElement = HTMLElement, D = TBlockMetaData> {
  readonly paitor: TPaitorInjectApi
  input: E

  constructor(instance: IEditorPlugin<E, D>)
  validData(): void
  mount(): void
  unmount(): void
  // focus(): void
  // blur(): void
  // empty(): boolean
  static type: string
}

export type TEditorPluginClass = typeof IEditorPlugin