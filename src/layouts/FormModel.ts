import axios from "axios";

export enum ElementType {
  Button = "Button",
  Text = "Text",
  Map = "Map"
}

export interface Element {
  uuid: String;
  type: ElementType;
  attributes: Array<ElementAttribute>;
  value?: String;
}

export enum ElementAttributeType {
  Number = "Number",
  String = "String",
  Boolean = "Boolean",
  Collection = "Collection",
}

export interface ElementAttribute {
  name: string;
  type: ElementAttributeType;
  value: any;
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
