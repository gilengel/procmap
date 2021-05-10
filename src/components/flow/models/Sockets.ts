import { Socket } from 'rete'

export default new Map([
  ['points', new Socket('points')],
  ['voronoi', new Socket('voronoi')],
  ['dimension', new Socket('dimension')],
  ['indices', new Socket('indices')],
  ['number', new Socket('number')],
  ['variable', new Socket('variable')],
  ['function', new Socket('function')]
])
