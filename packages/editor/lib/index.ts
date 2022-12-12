import Core from './core'
import presetPluginList from './plugins'
import type { IEditorOption, TCoreOption } from './types'
import './styles/index'

class Paitor {
  private readonly option: IEditorOption
  private core: Core

  constructor(option: IEditorOption) {
    this.verifyOptions(option)
    this.option = Paitor.mergeOption(option)
  }

  verifyOptions(option: IEditorOption) {
    if(!option) {
      throw new Error('Empty option.')
    }
    if(!option.container || !(option.container instanceof HTMLDivElement)) {
      throw new Error('Invalid container option')
    }
    return true
  }

  init() {
    if(this.core) return
    this.core = new Core(this.option as TCoreOption)
    this.core.render()
  }


  destory() {
    if(!this.core) return
    this.core.destory()
    this.core = null as any
  }

  static mergeOption(option: IEditorOption) {
    const defaultOption = Paitor.defaultOption()
    const data = Object.assign({}, defaultOption.data, option.data)
    const plugins = [...(option.plugins||[]), ...defaultOption.plugins]
    return Object.assign({}, defaultOption, option, {
      data,
      plugins,
    }) as IEditorOption
  }

  static defaultOption () {
    return {
      editable: true,
      data: {
        contents: [] as any[]
      },
      plugins: [...presetPluginList]
    }
  }
}

window['Paitor'] = Paitor

export default Paitor