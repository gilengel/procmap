/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Socket } from 'rete'

export default new Map<string, Socket>([
  ['variable', new Socket('variable') ],
])
