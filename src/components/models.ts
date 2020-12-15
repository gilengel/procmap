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
export class RandomMap implements Map {
  dimension: Dimension;
  points: Array<Point>;

  constructor (dimension: Dimension, points: Array<Point>) {
    this.dimension = dimension

    this.points = points
  }
}
