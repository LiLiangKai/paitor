import type { TEditorPluginClass } from '../types'

export default class Plugin {
  private list: Map<string, TEditorPluginClass>

  constructor(plugins: TEditorPluginClass[] = []) {
    this.list = new Map()
    for(let i=0; i<plugins.length; i++) {
      const plugin = plugins[i]
      if(this.list.has(plugin.type)) continue
      this.list.set(plugin.type, plugin)
    }
  }

  getPlugin(type: string) {
    return this.list.get(type)
  }
}