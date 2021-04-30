import { Point, Element } from './../models/Grid';
import { Vue, Component, Prop } from "vue-property-decorator";
import { v4 as uuidv4 } from "uuid";
import { colors } from 'quasar'
import * as math from 'mathjs'
import { Action, Getter } from 'vuex-class'
import { ElementConnection } from "src/models/Grid";
import { createTrianglePoints } from 'src/helpers/svg';
//import { SELECTED_CLASS } from '../store/SelectedElements';
export const LINKED = "linked";

const LINKAGE_PREVIEW = "linkage-preview";
const LINKAGE_TRIANGLE_PREVIEW = "linkage-triangle-preview";
const FOO = "foofoobarbar";

let GLOBAL_CANVAS: SVGElement | null = null;

let start: Array<number> = [0, 0]
let end: Array<number> = [0, 0]

let startElement: Element | null = null;
let endElement: Element | null = null;
let startRect: DOMRect | null = null;
let endRect: DOMRect | null = null;

function equal(rect1: DOMRect, rect2: DOMRect): boolean {
  return Math.ceil(rect1.x) === Math.ceil(rect2.x) &&
    Math.ceil(rect1.y) === Math.ceil(rect2.y) &&
    Math.ceil(rect1.width) === Math.ceil(rect2.width) &&
    Math.ceil(rect1.height) === Math.ceil(rect2.height)
}

function contains(rect: DOMRect, point: Array<number>): boolean {
  const x = Math.ceil(point[0])
  const y = Math.ceil(point[1])

  const l = Math.ceil(rect.x);
  const r = Math.ceil(rect.x + rect.width)
  const t = Math.ceil(rect.y);
  const b = Math.ceil(rect.y + rect.height)

  return x >= l && x <= r && y >= t && y <= b;
}

@Component
export class Linkage extends Vue {
  _linkageStarted: boolean = false;

  @Prop({ default: false }) active!: boolean;

  @Action('addToClassList')
  addToClassList!: (param: { element: Element, class: string }) => void

  @Action('removeFromClassList')
  removeFromClassList!: (param: { element: Element, class: string }) => void

  @Action('linkTwoElements')
  linkTwoElements!: (param: { start: Element, startPosition: Point, end: Element, endPosition: Point }) => void

  @Getter('connections')
  connections!: () => Array<ElementConnection>

  mounted() {
    this.registerEventListeners();

    GLOBAL_CANVAS = document.getElementsByTagName("svg")[0]



    this.createLine(0, 0, 0, 0, FOO)

    this.createTriangle(100, 100, 20, LINKAGE_TRIANGLE_PREVIEW)
  }

  beforeDestroy() {
    this.unregisterEventListeners();
  }

  mouseover(event: MouseEvent) {
    if (!this.active) return;

    this.addToClassList({ element: this.model, class: LINKED })

    endElement = this.model;
    endRect = this.$el.getBoundingClientRect();
  }

  mouseout(event: MouseEvent) {
    if (!this.active) return;

    event.preventDefault();


    this.removeFromClassList({ element: this.model, class: LINKED })

    endElement = null;
    endRect = null;
  }

  mousedown(event: MouseEvent) {
    if (!this.active) return;
    this._linkageStarted = true;


    this.addToClassList({ element: this.model, class: LINKED })

    start = [event.clientX, event.clientY];

    document.addEventListener('mousemove', this.mousemove)
    document.addEventListener('mouseup', this.mouseup)

    startElement = this.model;
    startRect = this.$el.getBoundingClientRect()

    this.createLine(start[0], start[1], start[0], start[1], LINKAGE_PREVIEW)
  }

  mousemove(event: MouseEvent) {
    if (!this.active) return;

    if (!start || !startRect) {
      return;
    }

    if (!GLOBAL_CANVAS) {
      return;
    }

    const top = GLOBAL_CANVAS.getBoundingClientRect().top;

    const previewLine = this.getPreviewLine();
    if (!previewLine) {
      return
    }

    let lineStartX = start[0];
    let lineStartY = start[1];
    let lineEndX = event.clientX
    let lineEndY = event.clientY

    let lineEnd = [event.clientX, event.clientY]

    if (contains(startRect, lineEnd)) {
      return
    }


    const startBottomInt = math.intersect(start, lineEnd, [startRect.left, startRect.bottom], [startRect.right, startRect.bottom])
    const startRightInt = math.intersect(start, lineEnd, [startRect.right, startRect.top], [startRect.right, startRect.bottom])

    lineStartX = startBottomInt[0] as number;
    lineStartY = startBottomInt[1] as number + 10;

    if (startBottomInt[0] > startRect.right) {
      lineStartX = startRightInt[0] as number + 10;
      lineStartY = startRightInt[1] as number;

    }


    if (endRect && !equal(startRect, endRect)) {
      const endTopInt = math.intersect(start, lineEnd, [endRect.left, endRect.top], [endRect.right, endRect.top])
      const endLeftInt = math.intersect(start, lineEnd, [endRect.left, endRect.top], [endRect.left, endRect.bottom])

      lineEndX = endTopInt[0] as number;
      lineEndY = endTopInt[1] as number - 10;

      if (endTopInt[0] < endRect.left) {
        lineEndX = endLeftInt[0] as number - 10;
        lineEndY = endLeftInt[1] as number;
      }
    }

    end[0] = lineEndX
    end[1] = lineEndY

    previewLine.setAttribute('x1', `${lineStartX}`)
    previewLine.setAttribute('y1', `${lineStartY - top + 30}`)
    previewLine.setAttribute('x2', `${lineEndX}`)
    previewLine.setAttribute('y2', `${lineEndY - top + 30}`)

    const previewTriangle = this.getPreviewTriangle();
    if (previewTriangle) {
      previewTriangle.setAttribute('points', createTrianglePoints(lineStartX, lineStartY, lineEndX, lineEndY))
    }
  }

  getPreviewLine(): SVGLineElement | null {
    const previewLines = document.getElementsByClassName(LINKAGE_PREVIEW);
    if (previewLines && previewLines.length > 0) {
      return previewLines[0] as SVGLineElement
    }

    return null;
  }

  getPreviewTriangle(): SVGPolygonElement | null {
    const previewTriangles = document.getElementsByClassName(LINKAGE_TRIANGLE_PREVIEW)
    if (previewTriangles && previewTriangles.length > 0) {
      return previewTriangles[0] as SVGPolygonElement
    }

    return null;
  }

  get canvas() {
    return document.getElementsByTagName("svg")[0];
  }

  createLine(x1: number, y1: number, x2: number, y2: number, className?: string) {
    const svg = this.canvas;
    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    if (className) {
      newLine.classList.add(className)
    }

    newLine.setAttribute('id', 'line2');
    newLine.setAttribute('x1', `${x1}`);
    newLine.setAttribute('y1', `${y1}`);
    newLine.setAttribute('x2', `${x2}`);
    newLine.setAttribute('y2', `${y2}`);
    svg.appendChild(newLine)
  }

  createTriangle(x: number, y: number, size: number, className?: string) {
    const svg = this.canvas;
    const newTriangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

    if (className) {
      newTriangle.classList.add(className)
    }

    newTriangle.setAttribute('points', '')
    svg.appendChild(newTriangle)
  }

  mouseup(event: MouseEvent) {
    if (!this.active) return;

    if (!startElement || !endElement || !start) {
      return
    }

    if (!GLOBAL_CANVAS) {
      return;
    }

    const previewLine = this.getPreviewLine();

    if (!previewLine) {
      return;
    }

      const startX = parseFloat(previewLine.getAttribute('x1') as string)
      const startY = parseFloat(previewLine.getAttribute('y1') as string)
      const endX = parseFloat(previewLine.getAttribute('x2') as string)
      const endY = parseFloat(previewLine.getAttribute('y2') as string)

      GLOBAL_CANVAS?.removeChild(previewLine)



    if (startElement && startElement.uuid !== this.model.uuid) {
      this.removeFromClassList({ element: startElement, class: LINKED })

      this.linkTwoElements({ start: startElement, startPosition: { x: startX, y: startY }, end: endElement, endPosition: { x: endX, y: endY } })

      startElement = null;
      endElement = null;
    }
  }

  registerEventListeners() {
    const el = this.$el as HTMLElement;
    el.addEventListener('mouseenter', this.mouseover)
    el.addEventListener('mouseout', this.mouseout)
    el.addEventListener('mousedown', this.mousedown)
    el.addEventListener('mouseup', this.mouseup)

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', this.mousemove)
    })
  }

  unregisterEventListeners() {
    const el = this.$el as HTMLElement;
    el.removeEventListener('mouseenter', this.mouseover)
    el.removeEventListener('mouseout', this.mouseout)
    el.removeEventListener('mousedown', this.mousedown)
    el.removeEventListener('mouseup', this.mouseup)
  }
}