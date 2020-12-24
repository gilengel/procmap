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

export interface Cell {
  lines: CellLine,
  center: Point,

  neighbours: [Cell]
}

export interface CellLine {
  start: number,
  end: number,

  leftCell: Cell,
  rightCell: Cell
}

export interface VoronoiModel {
  cells: [Cell]
}

export class RandomMap implements Map {
  dimension: Dimension;
  points: Array<Point>;

  constructor (dimension: Dimension, points: Array<Point>) {
    this.dimension = dimension

    this.points = points
  }
}

export class Color {
  red: number;
  green: number;
  blue: number;

  constructor (red:number, green:number, blue:number) {
    this.red = red
    this.green = green
    this.blue = blue
  }

  toCanvasString (): string {
    return `rgb(${this.red}, ${this.green}, ${this.blue})`
  }
}
