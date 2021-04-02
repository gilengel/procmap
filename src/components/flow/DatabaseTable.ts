/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

import axios from 'axios'
import { Store } from 'vuex'

interface User {
  id: number,
  created_at: number,
  name: string,
  address: string,
  email: string
}

export interface ServerResponse {
  data: User;
}

export default new FlowComponent({
  label: 'db_table',

  inputs: [
    {
      type: 'model',
      label: 'Model',
      mandatory: true
    },
  ],

  outputs: [
    {
      type: 'table_data',
      label: 'Table',
      mandatory: true
    }
  ],

  workerFn: (
    node: NodeData,
    _inputs: WorkerInputs,
    outputs: WorkerOutputs,
    _store: Store<unknown>
  ): Promise<void> => {

    return new Promise((resolve, reject) => {
      axios.request<User>({
        url: 'http://localhost:8000/users',
        transformResponse: (r: ServerResponse) => r.data
      })
        .then((response) => {
          const model = JSON.parse(response.request.response).content
          outputs.table_data = { data: model };

          resolve()
        })
        .catch((reason) => {
          reject(reason);
        })
    })
  }
})
