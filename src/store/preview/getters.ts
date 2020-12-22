import { FlowComponentWithPreview } from 'src/components/FlowGraph'
import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { PreviewStateInterface } from './state'

const getters: GetterTree<PreviewStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  },

  preview: PreviewStateInterface => {
    return 'Rainbow'
  }
}

export default getters
