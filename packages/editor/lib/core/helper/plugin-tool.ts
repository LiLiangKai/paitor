import { IEditorPluginApi, TBlockMetaData } from '../../types'

export default class PluginBase<D = TBlockMetaData>  {
  paitor: IEditorPluginApi<D>

  constructor(instance) {    
    return instance
  }
}