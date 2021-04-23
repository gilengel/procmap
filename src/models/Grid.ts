import { ElementAttribute } from './Grid';
export enum ElementType {
  Button = "Button",
  Text = "Text",
    Row = "Row",
  Heading = "Heading"
}



export interface Element {
  uuid: String;
  type: ElementType;
  attributes: Array<ElementAttribute>;
  column: Column;

  inputs?: Array<ElementAttribute>;
  outputs?: Array<ElementAttribute>;
}

export enum ElementAttributeType {
  Number = "Number",
  String = "String",
  Boolean = "Boolean",
}

export interface ElementAttribute {
  name: string;
  type: ElementAttributeType;
  value: any;
}

export interface Column {
  width: number;
  element: Element | null;
  row?: Row;
}

export interface Row {
  columns: Array<Column>;
}

export interface Grid {
  rows: Array<Row>;
}

export enum Direction {
  Left = 0,
  Right = 1,
}
