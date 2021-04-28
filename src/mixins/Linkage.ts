import { Point, Element } from './../models/Grid';
import { Vue, Component, Prop } from "vue-property-decorator";
import { v4 as uuidv4 } from "uuid";
import { colors } from 'quasar'

//import { SELECTED_CLASS } from '../store/SelectedElements';
export const LINKED = "linked";

const LINKAGE_PREVIEW = "linkage-preview";

let GLOBAL_CANVAS: SVGElement | null = null;

let start: { x: number, y: number } | null = null;

let startElement: Element | null = null;
let endElement: Element | null = null;
let startRect: DOMRect | null = null;
let endRect: DOMRect | null = null;

import { Action, Getter } from 'vuex-class'
import { ElementConnection } from "src/models/Grid";

@Component
export class Linkage extends Vue {
  _linkageStarted: boolean = false;

    @Prop({ default: false }) active!: boolean;

    @Action('addToClassList')
    addToClassList!: (param: { element: Element, class: string }) => void

    @Action('removeFromClassList')
    removeFromClassList!: (param: { element: Element, class: string }) => void

    @Action('linkTwoElements')
    linkTwoElements!: (param: { start: Element, end: Element }) => void

    @Getter('connections')
    connections!: () => Array<ElementConnection>

    mounted () {
        this.registerEventListeners();

        GLOBAL_CANVAS = document.getElementsByTagName("svg")[0]
    }

    beforeDestroy () {
        this.unregisterEventListeners();
    }

    mouseover (event: MouseEvent) {
        if (!this.active) return;

        this.addToClassList({ element: this.model, class: LINKED })

        endElement = this.model;
        endRect = this.$el.getBoundingClientRect();
    }

    mouseout (event: MouseEvent) {
        if (!this.active) return;

        event.preventDefault();


      this.removeFromClassList({ element: this.model, class: LINKED })

        endElement = null;
        endRect = null;
    }

    mousedown (event: MouseEvent) {
      if (!this.active) return;
      this._linkageStarted = true;


        this.addToClassList({ element: this.model, class: LINKED })

        start = { x: event.clientX, y: event.clientY };

        document.addEventListener('mousemove', this.mousemove)
        document.addEventListener('mouseup', this.mouseup)

        startElement = this.model;
        startRect = this.$el.getBoundingClientRect()

        this.createLine(start.x, start.y, start.x, start.y, LINKAGE_PREVIEW)
    }

    mousemove (event: MouseEvent) {
        if (!this.active) return;

        if (!start) {
            return;
        }

        if (!GLOBAL_CANVAS) {
            return;
        }

        if (startRect && endRect) {
            const facingDown = startRect.bottom < endRect.top;
            const facingRight = startRect.right < endRect.left;
            console.log(`${facingDown}  ${facingRight}`)
        }

        const previewLine = this.getPreviewLine();
        if (previewLine) {
            const top = GLOBAL_CANVAS.getBoundingClientRect().top;
            previewLine.setAttribute('x2', `${event.clientX}`)
            previewLine.setAttribute('y2', `${event.clientY - top}`)
        }
    }

    getPreviewLine (): SVGLineElement | null {
        const previewLines = document.getElementsByClassName(LINKAGE_PREVIEW);
        if (previewLines && previewLines.length > 0) {
            return previewLines[0] as SVGLineElement
        }

        return null;
    }

    createLine (x1: number, y1: number, x2: number, y2: number, className?: string) {
        const svg = document.getElementsByTagName("svg")[0];
        const bb = svg.getBoundingClientRect();
        var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        if (className) {
            newLine.classList.add(className)
        }
        
        newLine.setAttribute('id', 'line2');
        newLine.setAttribute('x1', `${x1}`);
        newLine.setAttribute('y1', `${y1 - bb.top}`);
        newLine.setAttribute('x2', `${x2}`);
        newLine.setAttribute('y2', `${y2 - bb.top}`);
        svg.appendChild(newLine)
    }

  mouseup(event: MouseEvent) {
      if (!this.active) return;

      if (!startElement || !endElement || !start) {
        return
      }

      this.createLine(start?.x, start?.y, event.clientX, event.clientY)

      const previewLine = this.getPreviewLine();
      if (previewLine) {
          GLOBAL_CANVAS?.removeChild(previewLine)
      }
      



      if (startElement && startElement.uuid !== this.model.uuid) {
        this.removeFromClassList({ element: startElement, class: LINKED })

        const end = { x: event.clientX, y: event.clientY };
        this.linkTwoElements({ start: startElement, startPosition: start, end: endElement, endPosition: end })

        startElement = null;
        endElement = null;
      }


        if (!GLOBAL_CANVAS) {
            return;
        }
    }

    registerEventListeners () {
        const el = this.$el as HTMLElement;
        el.addEventListener('mouseenter', this.mouseover)
        el.addEventListener('mouseout', this.mouseout)
        el.addEventListener('mousedown', this.mousedown)
        el.addEventListener('mouseup', this.mouseup)

        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', this.mousemove)
        })
    }

    unregisterEventListeners () {
        const el = this.$el as HTMLElement;
        el.removeEventListener('mouseenter', this.mouseover)
        el.removeEventListener('mouseout', this.mouseout)
        el.removeEventListener('mousedown', this.mousedown)
        el.removeEventListener('mouseup', this.mouseup)
    }
}
