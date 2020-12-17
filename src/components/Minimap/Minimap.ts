import { NodeEditor } from 'rete'
import Vue from 'vue'
import Map from './Map.vue'

enum Size {
    Small = 'small',
    Middle = 'middle',
    Large = 'large'
}

function install (editor: NodeEditor, params: Record<string, unknown>) {
  Vue.observable(params)
  params.enable = params.enable !== false
  params.size = params.size || Size.Middle

  const el = document.createElement('div')

  editor.view.container.appendChild(el)

  const app = new Vue({
    render: h => params.enable ? h(Map, {
      props: {
        size: params.size,
        nodes: editor.nodes,
        views: editor.view.nodes,
        view: editor.view
      }
    }) : null
  }).$mount(el)

  const updateTransform = () => app.$children[0] && app.$children[0].updateTransform()

  editor.on('nodetranslated nodecreated noderemoved translated zoomed', updateTransform)
  window.addEventListener('resize', updateTransform)

  editor.on('destroy', () => {
    window.removeEventListener('resize', updateTransform)
  })
}

export default {
  install,
  ...Size
}
