import { TPBlock } from './block'
import { TPCore } from './core'

export class IEditorPlugin {
  input: HTMLElement

  constructor(block: TPBlock, core: TPCore)
  validData(): void
  mount(): void
  unmount(): void
  focus(): void
  blur(): void
  static type: string
}

export type TEditorPluginClass = typeof IEditorPlugin