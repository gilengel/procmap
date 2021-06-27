
import { Element, ElementAttribute } from '../../models/Grid'
import { v4 as uuidv4 } from 'uuid';
import { ElementType } from 'src/layouts/FormModel';
import { ElementAttributeType, Grid, ElementConnection } from 'src/models/Grid'

export function createTextElement(): Element {
  const widgetAttributes = new Array<ElementAttribute>();

  widgetAttributes.push({
    name: 'variable',
    type: ElementAttributeType.String,
    value: 'Some_text',
  });
  widgetAttributes.push({
    name: 'label',
    type: ElementAttributeType.String,
    value: 'Some text',
  });
  widgetAttributes.push({
    name: 'type',
    type: ElementAttributeType.String,
    value: 'text',
  });
  widgetAttributes.push({
    name: 'withLabel',
    type: ElementAttributeType.Boolean,
    value: true,
  });

  return {
    uuid: uuidv4(),
    type: ElementType.Text,
    attributes: widgetAttributes,
    classList: [],
    inputs: [
      {
        identifier: 'text',
        type: ElementAttributeType.String,
        children: []
      }
    ],
    outputs: [
      {
        identifier: 'text',
        type: ElementAttributeType.String,
        children: []
      }
    ]
  }
}



const DefaultGrid : Grid = {
  rows: [
    {
      columns: [
        { width: 4, element: null },
        { width: 8, element: null },
      ],
    },

    {
      columns: [
        { width: 4, element: null },
        { width: 4, element: null },
        { width: 4, element: null },
      ],
    },

    {
      columns: [
        { width: 6, element: null },
        { width: 6, element: null },
      ],
    },
  ],
};

export interface GridStateInterface {
  _grid: Grid,
  _connections: ElementConnection[]
}

function state(): GridStateInterface {
  return {
    _grid: DefaultGrid,
    _connections: []
  }
};

export default state;
