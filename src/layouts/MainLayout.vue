<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <grid-layout
          :layout.sync="layout"
          :col-num="12"
          :row-height="30"
          :is-draggable="true"
          :is-resizable="true"
          :vertical-compact="true"
          :use-css-transforms="true"
          :margin="[0, 0]"
          class="noselect"
        >
          <grid-item
            v-for="item in layout"
            :key="item.i"
            :static="item.static"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            drag-allow-from=".vue-draggable-handle"
            drag-ignore-from=".no-drag"
          >
            <component
              :is="item.component"
              :ref="item.component + item.i"
              v-bind="item.properties"
              @add-widget="onAddWidget"
            />
          </grid-item>
        </grid-layout>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";

import { GridLayout, GridItem } from "vue-grid-layout";
import Widget from "components/Widget.vue";
import TableWidget from "components/TableWidget.vue";
import ImageWidget from "components/ImageWidget.vue";
import TextWidget from "components/TextWidget.vue";
import ChartWidget from "src/components/ChartWidget.vue";
import FlowGraphWidget from "components/FlowGraphWidget.vue";
import MapWidget from "components/MapWidget.vue";
import TodoWidget from "components/TodoWidget.vue";

import { Node as ReteNode } from "rete";

interface WidgetData {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
  component: string;
  properties?: any;
  static: boolean;
}

@Component({
  name: "MainLayout",

  components: {
    GridLayout,
    GridItem,
    Widget,
    TableWidget,
    ImageWidget,
    TextWidget,
    FlowGraphWidget,
    ChartWidget,
    MapWidget,
    TodoWidget
  }
})
export default class MainLayout extends Vue {
  layout = [
    {
      x: 0,
      y: 0,
      w: 6,
      h: 16,
      i: "0",
      static: true,
      component: "FlowGraphWidget"
    }
    // { x: 6, y: 0, w: 6, h: 16, i: '1', static: true, component: 'text' },
    // { x: 9, y: 0, w: 3, h: 8, i: '3', static: false, component: 'Widget' },
    // { x: 9, y: 8, w: 3, h: 8, i: '4', static: false, component: 'Widget' },
  ];

  draggable = true;
  resizable = true;
  colNum = 12;
  index = 0;

  mounted() {
    this.index = this.layout.length;
  }

  getWidgetName(element: string) {
    return `${element.charAt(0).toUpperCase()}${element.slice(1)}Widget`;
  }

  onAddWidget(element: ReteNode) {
    let properties = null;
    // this.$refs['Widget1'].appendChild(instance.$el)
    if (element.name === "image") {
    } else if (element.name === "text") {
      properties = {
        text: `
[Intro]
We lost everything
We had to pay the price
Yeah we lost everything
We had to pay the price

[Verse 1]
I saw in you what life was missing
You lit a flame that consumed my hate
I'm not one for reminiscing but
I'd trade it all for your sweet embrace

[Post-Verse]
Yeah
Cause we lost everything
We had to pay the price

[Verse 2]
There's a canvas with two faces
Of fallen angels who loved and lost
It was a passion for the ages
And in the end guess we paid the cost

[Bridge]
A thing of beauty — I know
Will never fade away
What you did to me — I know
Said what you had to say
But a thing of beauty
[Chorus]
Will never fade away
Will never fade away
Will never fade away

[Verse 3]
I see your eyes, i know you see me
You're like a ghost how you're everywhere
I am your demon never leaving
A metal soul of rage and fear

[Post-Verse]
That one thing that changed it all
That one sin that caused the fall

[Bridge]
A thing of beauty — I know
Will never fade away
What you did to me — I know
Said what you had to say
But a thing of beauty — I know
Will never fade away
And I'll do my duty — I know
Somehow I'll find a way
But a thing of beauty
Will never fade away
And I'll do my duty

[Chorus]
Yeah
We'll never fade away
We'll never fade away
We'll never fade away
We'll never fade away        
        `
      };
    } else if (element.name === "table") {
    } else if (element.name === "chart") {
    }

    this.layout.push({
      x: 6,
      y: this.layout.length + (this.colNum || 12), // puts it at the bottom
      w: 3,
      h: 16,
      i: `${this.index}`,
      static: false,
      properties: properties,
      component: this.getWidgetName(element.name)
    });

    this.index++;
  }

  itemTitle(item: WidgetData) {
    let result = item.i;
    if (item.static) {
      result += " - Static";
    }
    return result;
  }
}
</script>

<style lang='scss'>
body {
  background: rgb(30, 30, 30);
}

html,
body {
  background: $dark-page;
  height: 100%;
}

.vue-grid-layout {
  height: 100vh !important;
  overflow: hidden;
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: $dark-page;
}
.vue-grid-item .resizing {
  opacity: 0.9;
}
.vue-grid-item .static {
  background: green;
}
.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}
.vue-grid-item .minMax {
  font-size: 12px;
}
.vue-grid-item .add {
  cursor: pointer;
}
.vue-grid-item {
  transform: none impor !important;
}
.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>
