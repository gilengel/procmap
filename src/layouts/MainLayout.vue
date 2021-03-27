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
              :uuid="item.i"
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
import IdeWidget from 'components/IdeWidget.vue'
import TodoWidget from "components/TodoWidget.vue";

import { Node as ReteNode } from "rete";

import { v4 as uuidv4 } from 'uuid'

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
    IdeWidget
    MapWidget,
    TodoWidget
  }
})
export default class MainLayout extends Vue {
  draggable = true;
  resizable = true;
  colNum = 12;
  index = 0;

   layout = [
    {
      x: 0,
      y: 0,
      w: 6,
      h: 16,
      i: uuidv4(),
      static: true,
      properties: {},
      component: 'FlowGraphWidget'
    },
  ];

  mounted () {
    this.index = this.layout.length
  }

  getWidgetName(element: string) {
    return `${element.charAt(0).toUpperCase()}${element.slice(1)}Widget`;
  }

  onAddWidget (element: ReteNode) {
    const properties = {}
    if (element.name === 'TextFilter') {
      return
    }

    this.layout.push({
      x: 6,
      y: this.layout.length + (this.colNum || 12), // puts it at the bottom
      w: 6,
      h: 16,
      i: `${element.data.uuid}`,
      static: false,
      properties: properties,
      component: this.getWidgetName(element.name)
    })
    this.index++
  }
}
</script>

<style lang='scss'>
body {
  background: $dark-page;
}

html,
body {
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
