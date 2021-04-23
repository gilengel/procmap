import { Vue, Component, Prop } from "vue-property-decorator";
import { v4 as uuidv4 } from "uuid";

import { SELECTED_CLASS } from '../store/SelectedElements';

let GLOBAL_CANVAS: HTMLCanvasElement | null = null;

let start: { x: number, y: number } | null = null;

let startElement : Element | null = null;

@Component
export class Linkage extends Vue {
  @Prop() active!: boolean;

  mounted() {
    this.registerEventListeners();
  }

  beforeDestroy() {
    this.unregisterEventListeners();
  }

  mouseover(event: MouseEvent) {
    if (!this.active) return;

    this.$el.classList.add(SELECTED_CLASS)
  }

  mouseout(event: MouseEvent) {
    if (!this.active) return;

    this.$el.classList.remove(SELECTED_CLASS)
  }

  mousedown(event: MouseEvent) {
    if (!this.active) return;

    this.createAndAppendCanvas();

    start = { x: event.clientX, y: event.clientY };

    document.addEventListener('mousemove', this.mousemove)
    document.addEventListener('mouseup', this.mouseup)

    this.$el.classList.add(SELECTED_CLASS)

    startElement = this.model;
  }

  mousemove(event: MouseEvent) {
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
    ctx.strokeStyle = "salmon";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    this.createConnectionEndpoint(start, ctx, lineWidth);
    this.createConnectionEndpoint({ x: event.clientX, y: event.clientY}, ctx, lineWidth);
  }


  private createConnectionEndpoint(position: { x: number, y: number }, ctx: CanvasRenderingContext2D, lineWidth: number) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, lineWidth * 2, 0, 2 * Math.PI);
    ctx.fillStyle = "salmon";
    ctx.fill();
  }

  private createAndAppendCanvas() {
    const bodySize = document.body.getBoundingClientRect();
    if (!GLOBAL_CANVAS) {
      GLOBAL_CANVAS = document.createElement('canvas');
      GLOBAL_CANVAS.id = uuidv4();
      GLOBAL_CANVAS.width = bodySize.width;
      GLOBAL_CANVAS.height = bodySize.height;
    }

    document.body.appendChild(GLOBAL_CANVAS);
  }

  mouseup(event: MouseEvent) {
    if (!this.active) return;

    if (startElement) {
      console.log(startElement)
    }

    document.removeEventListener('mousemove', this.mousemove)

    if (!GLOBAL_CANVAS) {
      return;
    }

    document.body.removeChild(GLOBAL_CANVAS);

    const ctx = GLOBAL_CANVAS.getContext("2d");
    if (!ctx) {
      return
    }

    ctx.clearRect(0, 0, GLOBAL_CANVAS.width, GLOBAL_CANVAS.height);
  }


  registerEventListeners() {
    const el = this.$el as HTMLElement;
    el.addEventListener('mouseenter', this.mouseover)
    el.addEventListener('mouseout', this.mouseout)
    el.addEventListener('mousedown', this.mousedown)
    el.addEventListener('mouseup', this.mouseup)
  }

  unregisterEventListeners() {
    const el = this.$el as HTMLElement;
    el.removeEventListener('mouseenter', this.mouseover)
    el.removeEventListener('mouseout', this.mouseout)
    el.removeEventListener('mousedown', this.mousedown)
    el.removeEventListener('mouseup', this.mouseup)
  }

}
