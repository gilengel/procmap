
export function drag (el: HTMLElement, getInitial: () => [number, number], onDrag: (dx: number, dy: number, initial: [number, number]) => [number, number]) {
  let start: [number, number] = [0, 0]
  let initial: [number, number] = [0, 0]

  el.addEventListener('mousedown', e => {
    initial = getInitial()
    start = [e.pageX, e.pageY]
  })
  window.addEventListener('mousemove', e => {
    if (start === [0, 0]) return
    const [dx, dy] = [start[0] - e.pageX, start[1] - e.pageY]

    onDrag(dx, dy, initial)
  })
  window.addEventListener('mouseup', () => {
    start = [0, 0]
  })
}
