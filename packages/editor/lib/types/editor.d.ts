import type { TBlockMeta } from './block'
import type { TEditorPluginClass } from './plugin'

export interface IEditorData {
  title?: string
  contents?: TBlockMeta[]
}

export interface IEditorOption {
  editable?: boolean
  container: HTMLDivElement
  data?: IEditorData
  plugins?: TEditorPluginClass[]
}
