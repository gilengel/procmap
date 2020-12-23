import { Node, NodeEditor } from 'rete'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { VNode } from 'vue'

interface Foo extends Vue{
  bindSocket(el: HTMLElement, arg: unknown, value: unknown): void
  bindControl(el: HTMLElement, value: unknown): void
}
@Component({
  directives: {

    socket: {
      bind (el: HTMLElement, binding: { arg: unknown, value: unknown}, vnode: VNode) {
        (vnode.context as Vue & Foo).bindSocket(el, binding.arg, binding.value)
      },
      update (el: HTMLElement, binding: { arg: unknown, value: unknown}, vnode: VNode) {
        (vnode.context as Vue & Foo).bindSocket(el, binding.arg, binding.value)
      }
    },
    control: {
      bind (el: HTMLElement, binding: { arg: unknown, value: unknown}, vnode: VNode) {
        if (!binding.value) return

        (vnode.context as Vue & Foo).bindControl(el, binding.value)
      }
    }

  }
})

export default class Mixin extends Vue {
  @Prop(Node) node!: Node
  @Prop(NodeEditor) editor!: NodeEditor
  @Prop() bindSocked!: undefined
  @Prop() bindControl!: undefined

  inputs () {
    return Array.from(this.node.inputs.values())
  }

  outputs () {
    return Array.from(this.node.outputs.values())
  }

  controls () {
    return Array.from(this.node.controls.values())
  }

  selected () {
    return this.editor.selected.contains(this.node) ? 'selected' : ''
  }
}
