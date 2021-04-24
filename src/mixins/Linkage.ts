import { Vue, Component, Prop } from "vue-property-decorator";
import { v4 as uuidv4 } from "uuid";
import { colors } from 'quasar'

//import { SELECTED_CLASS } from '../store/SelectedElements';
export const LINKED = "linked";

let GLOBAL_CANVAS: HTMLCanvasElement | null = null;

let start: { x: number, y: number } | null = null;

let startElement: Element | null = null;
let startRect: DOMRect | null = null;

import { Action, Getter } from 'vuex-class'
import { ElementConnection } from "src/models/Grid";

@Component
export class Linkage extends Vue {
    @Prop({ default: true }) active!: boolean;

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
    }

    beforeDestroy () {
        this.unregisterEventListeners();
    }

    mouseover (event: MouseEvent) {
        if (!this.active) return;

        this.addToClassList({ element: this.model, class: LINKED })
    }

    mouseout (event: MouseEvent) {
        if (!this.active) return;

        event.preventDefault();

        this.removeFromClassList({ element: this.model, class: LINKED })
    }

    mousedown (event: MouseEvent) {
        
        if (!this.active) return;

        this.addToClassList({ element: this.model, class: LINKED })

        this.createAndAppendCanvas();

        start = { x: event.clientX, y: event.clientY };

        document.addEventListener('mousemove', this.mousemove)
        document.addEventListener('mouseup', this.mouseup)

        startElement = this.model;
        startRect = this.$el.getBoundingClientRect()
        
    }

    mousemove (event: MouseEvent) {
        if (!this.active) return;

        if (!start) {
            return;
        }

        if (!GLOBAL_CANVAS) {
            return;
        }

        const ctx = GLOBAL_CANVAS.getContext("2d");
        if (!ctx) {
            return
        }

        const lineWidth = 4;
        ctx.clearRect(0, 0, GLOBAL_CANVAS.width, GLOBAL_CANVAS.height);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(event.clientX, event.clientY);
        ctx.strokeStyle = colors.getBrand('accent');
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        for (const connection of this.connections) {
            ctx.beginPath();
            ctx.moveTo(connection.start.x, connection.start.y);
            ctx.lineTo(connection.end.x, connection.end.y);
            ctx.strokeStyle = colors.getBrand('accent');
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }

        this.createConnectionEndpoint(start, ctx, lineWidth);
        this.createConnectionEndpoint({ x: event.clientX, y: event.clientY }, ctx, lineWidth);
    }

    mouseup (event: MouseEvent) {
        if (!this.active) return;

        if (startElement && startElement.uuid !== this.model.uuid) {
            this.removeFromClassList({ element: startElement, class: LINKED })

            const end = { x: event.clientX, y: event.clientY };
            this.linkTwoElements({ start: startElement, startPosition: start, end: this.model, endPosition: end })
        }

        document.removeEventListener('mousemove', this.mousemove)

        if (!GLOBAL_CANVAS) {
            return;
        }

        if (document.body.getElementsByTagName('canvas').length > 0) {
            document.body.removeChild(GLOBAL_CANVAS);
        }

        const ctx = GLOBAL_CANVAS.getContext("2d");
        if (!ctx) {
            return
        }

        ctx.clearRect(0, 0, GLOBAL_CANVAS.width, GLOBAL_CANVAS.height);
    }


    private createConnectionEndpoint (position: { x: number, y: number }, ctx: CanvasRenderingContext2D, lineWidth: number) {
        ctx.beginPath();
        ctx.arc(position.x, position.y, lineWidth * 2, 0, 2 * Math.PI);
        ctx.fillStyle = colors.getBrand('accent');
        ctx.fill();
    }

    private createAndAppendCanvas () {
        const bodySize = document.body.getBoundingClientRect();
        if (!GLOBAL_CANVAS) {
            GLOBAL_CANVAS = document.createElement('canvas');
            GLOBAL_CANVAS.id = uuidv4();
            GLOBAL_CANVAS.width = bodySize.width;
            GLOBAL_CANVAS.height = bodySize.height;
        }

        document.body.appendChild(GLOBAL_CANVAS);
    }

    registerEventListeners () {
        const el = this.$el as HTMLElement;
        el.addEventListener('mouseenter', this.mouseover)
        el.addEventListener('mouseout', this.mouseout)
        el.addEventListener('mousedown', this.mousedown)
        el.addEventListener('mouseup', this.mouseup)
    }

    unregisterEventListeners () {
        const el = this.$el as HTMLElement;
        el.removeEventListener('mouseenter', this.mouseover)
        el.removeEventListener('mouseout', this.mouseout)
        el.removeEventListener('mousedown', this.mousedown)
        el.removeEventListener('mouseup', this.mouseup)
    }

}
