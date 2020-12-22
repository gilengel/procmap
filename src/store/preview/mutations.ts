import { Node } from 'rete'
import { MutationTree } from 'vuex'
import { PreviewStateInterface } from './state'

const mutation: MutationTree<PreviewStateInterface> = {
  update (state: PreviewStateInterface, node: Node) {
    console.log('This is weird')
  }
}

export default mutation
