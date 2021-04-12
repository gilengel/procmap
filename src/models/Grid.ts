export enum ElementType {
  Button = "Button",
  Text = "Text",
  Row = "Row"
}

export interface Element {
  uuid: String;
  type: ElementType;
  attributes: Array<ElementAttribute>;
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
