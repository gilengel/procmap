import { Socket } from 'rete'

const registeredSockets = new Map([
  ['variable', new Socket('variable')],
])

export default registeredSockets;
