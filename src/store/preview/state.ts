import { Node } from 'rete'

export interface PreviewStateInterface {
  prop: boolean;

  node: Node
}

const state: PreviewStateInterface = {
  node: null
}

export default state
