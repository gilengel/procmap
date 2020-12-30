export interface Map {
  dimension: Dimension;
}

export interface Dimension {
  width: number;
  height: number;
}
export interface Point {
  x: number;
  y: number;
}

export class Cell {
  points: Array<Point> = []
  // lines: CellLine,
  center: Point = { x: 0, y: 0 }

  // neighbours: [Cell],
}

export interface CellLine {
  start: number,
  end: number,

  leftCell: Cell,
  rightCell: Cell
}

export abstract class Drawable {
  abstract draw (context: CanvasRenderingContext2D): void
}
export class VoronoiModel implements Drawable {
  points: Array<Point> = []
  cells: Array<Cell> = []

  randColor (): string {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)

    return `rgba(${r}, ${g}, ${b}, 0.6)`
  }

  draw (ctx: CanvasRenderingContext2D) {
    for (const cell of this.cells) {
      const points = cell.points

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length - 1; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.closePath()
      ctx.fillStyle = this.randColor()
      ctx.fill()
    }
  }
}

export class RandomMap implements Map {
  dimension: Dimension;
  points: Array<Point>;

  constructor(dimension: Dimension, points: Array<Point>) {
    this.dimension = dimension

    this.points = points
  }
}

export class Color {
  red: number;
  green: number;
  blue: number;

  constructor(red: number, green: number, blue: number) {
    this.red = red
    this.green = green
    this.blue = blue
  }

  toCanvasString (): string {
    return `rgb(${this.red}, ${this.green}, ${this.blue})`
  }
}
