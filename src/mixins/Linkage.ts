import { Point, Element } from './../models/Grid';
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import * as math from 'mathjs'
import { Action, Getter } from 'vuex-class'
import { ElementConnection } from "src/models/Grid";
import { createTrianglePoints } from 'src/helpers/svg';
export const LINKED = "linked";

const LINKAGE_PREVIEW = "linkage-preview";
const LINKAGE_TRIANGLE_PREVIEW = "linkage-triangle-preview";

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

  @Watch('active')
  onActiveChange(val: boolean) {
    if (val) {
      this.registerEventListeners();
    } else {
      this.unregisterEventListeners();
    }
  }

  @Action('addToClassList')
  addToClassList!: (param: { element: Element, class: string }) => void

  @Action('removeFromClassList')
  removeFromClassList!: (param: { element: Element, class: string }) => void

  @Action('linkTwoElements')
  linkTwoElements!: (param: { identifier: string, start: Element, startPosition: Point, end: Element, endPosition: Point }) => void

  @Getter('connections')
  connections!: () => Array<ElementConnection>

  mounted() {
    //this.registerEventListeners();

    GLOBAL_CANVAS = document.getElementsByTagName("svg")[0]


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
    if (!GLOBAL_CANVAS) return;

    this._linkageStarted = true;


    this.addToClassList({ element: this.model, class: LINKED })

    const bb = GLOBAL_CANVAS.getBoundingClientRect();
    start = [event.clientX, event.clientY];

    document.addEventListener('mousemove', this.mousemove)
    document.addEventListener('mouseup', this.mouseup)

    startElement = this.model;
    startRect = this.$el.getBoundingClientRect()

    this.createLine(start[0] - bb.left, start[1] - bb.top, start[0] - bb.left, start[1] - bb.top, LINKAGE_PREVIEW)
  }


  pointOnRect(point: Array<number>, rect: DOMRect, offset: number): Array<number> {
    var midX = (rect.left + rect.right) / 2;
    var midY = (rect.top + rect.bottom) / 2;
    var m = (start[1] - point[1]) / (start[0] - point[0]);

    if (point[0] <= midX) { // check "left" side
      var minXy = m * (rect.left - point[0]) + point[1];
      if (rect.top <= minXy && minXy <= rect.bottom)
        return [rect.left - offset, minXy];
    }

    if (point[0] >= midX) { // check "right" side
      var maxXy = m * (rect.right - point[0]) + point[1];
      if (rect.top <= maxXy && maxXy <= rect.bottom)
        return [rect.right + offset, maxXy];
    }

    if (point[1] <= midY) { // check "top" side
      var minYx = (rect.top - point[1]) / m + point[0];
      if (rect.left <= minYx && minYx <= rect.right)
        return [minYx, rect.top - offset];
    }

    if (point[1] >= midY) { // check "bottom" side
      var maxYx = (rect.bottom - point[1]) / m + point[0];
      if (rect.left <= maxYx && maxYx <= rect.right)
        return [maxYx, rect.bottom + offset];
    }

    // edge case when finding midpoint intersection: m = 0/0 = NaN
    if (point[0] === midX && point[1] === midY) return point;

    return point
  }

  mousemove(event: MouseEvent) {
    if (!this.active) return;

    if (!start || !startRect) {
      return;
    }

    if (!GLOBAL_CANVAS) {
      return;
    }

    const bb = GLOBAL_CANVAS.getBoundingClientRect();

    const previewLine = this.getPreviewLine();
    if (!previewLine) {
      return
    }

    let lineEnd = [event.clientX, event.clientY]
    const lineStart = this.pointOnRect(lineEnd, startRect, 10)

    if (endRect && !equal(startRect, endRect)) {
      lineEnd = this.pointOnRect(lineStart, endRect, 10)
    }

    end[0] = lineEnd[0]
    end[1] = lineEnd[1]


    previewLine.setAttribute('x1', `${lineStart[0] - bb.left}`)
    previewLine.setAttribute('y1', `${lineStart[1] - bb.top}`)
    previewLine.setAttribute('x2', `${lineEnd[0] - bb.left}`)
    previewLine.setAttribute('y2', `${lineEnd[1] - bb.top}`)

    const previewTriangle = this.getPreviewTriangle();
    if (previewTriangle) {
      previewTriangle.setAttribute('points', createTrianglePoints(lineStart[0], lineStart[1] - top, lineEnd[0], lineEnd[1] - top))
    }
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

    GLOBAL_CANVAS.removeChild(this.getPreviewTriangle())



    if (startElement && startElement.uuid !== this.model.uuid && startElement.outputs && startElement.outputs.length > 0) {
      this.removeFromClassList({ element: startElement, class: LINKED })

      const left = GLOBAL_CANVAS.getBoundingClientRect().left
      this.linkTwoElements({ identifier: startElement.outputs[0].identifier, start: startElement, startPosition: { x: startX + left, y: startY }, end: endElement, endPosition: { x: endX + left, y: endY } })

      startElement = null;
      endElement = null;
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

  removePreviewTriangle() {
    const previewTriangles = document.getElementsByClassName(LINKAGE_TRIANGLE_PREVIEW)
    if (previewTriangles && previewTriangles.length > 0) {
      previewTriangles[0].parentNode?.removeChild(previewTriangles[0])
    }
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

    document.removeEventListener('mouseup', this.mouseup)
  }
}
