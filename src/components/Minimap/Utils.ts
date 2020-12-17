import Node from 'rete'

export function nodesBBox (nodes: Array<unknown>, nv = () => {}) {
  const lefts = nodes.map(n => n.position[0])
  const rights = nodes.map(n => n.position[0] + nv(n).clientWidth)
  const tops = nodes.map(n => n.position[1])
  const bottoms = nodes.map(n => n.position[1] + nv(n).clientHeight)
  const left = Math.min(...lefts),
    right = Math.max(...rights),
    top = Math.min(...tops),
    bottom = Math.max(...bottoms)

  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top
  }
}
