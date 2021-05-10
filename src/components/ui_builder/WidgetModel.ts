import { FlowComponent } from "../../components/flow/FlowGraph";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { Store } from "vuex";

import VariableControl from "components/controls/VariableControl.vue"
import NumberControl from "components/controls/NumberControl.vue"

export const WIDGET_FLOW_ROUTER_INPUT = "input";
export const FLOW_ROUTER_PAGE = "page";
export const FLOW_ROUTER_END = "end";


export const WidgetInputComponent = new FlowComponent({
  label: WIDGET_FLOW_ROUTER_INPUT,


  inputs: [
    {
      type: 'number',
      id: 'amount',
      label: 'Amount',
      mandatory: true,


      control: {
        identifier: 'amount',
        component: NumberControl,
        isValid: (input: unknown): boolean => {
          const number = input as number

          return (number >= 0 && number <= 20000)
        }
      }

    },
  ],


  outputs: [
    {
      type: "page",
      label: "Input",
      mandatory: true,
    },
  ],


  controls: [
    {
      identifier: 'amount',
      component: NumberControl,
      isValid: (input: unknown): boolean => {
        const number = input as number

        return (number >= 0 && number <= 20000)
      }
    }
  ],


  workerFn: (
    node: NodeData,
    _inputs: WorkerInputs,
    _outputs: WorkerOutputs,
  ): Promise<void> => {
    return new Promise((resolve) => {
      // Default do noting
      resolve();
    });
  },
});


export const PageFlowComponent = new FlowComponent({
  label: FLOW_ROUTER_PAGE,

  inputs: [
    {
      type: "page",
      label: "Previous",
      mandatory: true,
    },
  ],

  outputs: [
    {
      type: "page",
      label: "Next",
      mandatory: true,
    },
  ],

  workerFn: (
    node: NodeData,
    _inputs: WorkerInputs,
    _outputs: WorkerOutputs,
    store?: Store<unknown>
  ): Promise<void> => {
    return new Promise((resolve) => {
      let model = store?.getters.model(node.data.uuid);

      // Create default data and add to local cache
      if (model === undefined) {
        const date = new Date().toJSON().slice(0, -1);
        model = {
          page_id: node.data.uuid,
          name: "" + Math.floor(Math.random() * 101),
          created_at: date,
          fk_layout_id: 1,
        };

        store?.dispatch("updateModel", { uuid: node.data.uuid, model: model });
      }

      // Default do noting
      resolve();
    });
  },
});

export const EndFlowComponent = new FlowComponent({
  label: FLOW_ROUTER_END,

  inputs: [
    {
      type: "page",
      label: "Next",
      mandatory: true,
    },
  ],

  workerFn: (
    _node: NodeData,
    _inputs: WorkerInputs,
    _outputs: WorkerOutputs,
  ): Promise<void> => {
    return new Promise((resolve) => {
      // Default do noting
      resolve();
    });
  },
});
