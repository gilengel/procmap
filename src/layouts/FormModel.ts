import { ElementAttributeType } from 'src/models/Grid'

export enum ElementType {
  Button = 'Button',
  Text = 'Text',
  Map = 'Map'
}

export interface Element {
  uuid: string;
  type: ElementType;
  attributes: Array<ElementAttribute>;
  value?: string;
}
export interface ElementAttribute {
  name: string;
  type: ElementAttributeType;
  value: unknown;
}

export interface Column {
  width?: number | string;
  element: Element | null;
}

export interface Row {
  columns: Array<Column>;
}

export interface Grid {
  rows: Array<Row>;
}

export interface ServerResponse {
  data: Grid;
}
