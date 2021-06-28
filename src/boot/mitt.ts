import { boot } from 'quasar/wrappers';
import mitt, {Emitter} from 'mitt';

import { Node } from 'rete'

export const ADD_MODEL = 'AddModel';
export const FLOW_NODE_SELECTED = 'FlowNodeSelected';
export const FLOW_NODE_ADDED = 'FlowNodeAdded';
export const FLOW_NODE_REMOVED = 'FlowNodeRemoved';
export const FLOW_NODES_CONNECTED = 'FlowNodesConnected';
export const FLOW_NODES_DISCONNECTED = 'FlowNodesDisconnected';
export const FLOW_GRAPH_UPDATED = 'FlowGraphUpdated';
export const FLOW_GRAPH_IMPORTED = 'FlowGraphImported';
export const FLOW_GRAPH_MANUALLY_CHANGED = 'FlowGraphManuallyChanged';

export type Events = {
  'FlowNodeSelected': Node,
  'FlowNodeAdded': Node,
  'FlowGraphManuallyChanged': JSON,
  'FlowGraphImported': Record<string, unknown>

}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $mitt: Emitter<Events>;
  }
}

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$mitt = mitt();
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
});
