import { IEditorPlugin, IEditorPluginApi, TBlockMetaData } from '../../types'

export default class PluginBase<D = TBlockMetaData> implements IEditorPlugin {
  paitor: IEditorPluginApi<D>
  input: HTMLElement

  constructor(instance) {    
    return instance
  }

  mount() {}
  unmount() {}
  focus() {}
  blur() {}
  validData() {}
}