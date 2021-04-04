import Vue from 'vue';

const EventBus = new Vue();

export const ADD_MODEL = "AddModel";
export const FLOW_NODE_SELECTED = "FlowNodeSelected";
export const FLOW_NODE_ADDED = "FlowNodeAdded";
export const FLOW_NODE_REMOVED = "FlowNodeRemoved";
export const FLOW_GRAPH_UPDATED = "FlowGraphUpdated";
export const FLOW_GRAPH_IMPORTED = "FlowGraphImported";

export default EventBus;
