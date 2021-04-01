<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>View Builder</q-toolbar-title>
          <q-btn
            flat
            round
            dense
          >
            <q-btn
              round
              color="primary"
              icon="las la-save"
              @click="saveLayout"
            />
          </q-btn>
        </q-toolbar>

        <h1 v-if="!layout">
          Something went wrong loading the view :(
        </h1>

        <grid-layout
          v-else
          :layout.sync="layout.widgets"
          :col-num="12"
          :row-height="30"
          :is-draggable="true"
          :is-resizable="true"
          :vertical-compact="true"
          :use-css-transforms="false"
          :margin="[0, 0]"
          class="noselect"
        >
          <grid-item
            v-for="widget in layout.widgets"
            :key="widget.id"
            :static="widget.static"
            :x="widget.x"
            :y="widget.y"
            :w="widget.w"
            :h="widget.h"
            :i="widget.i"
            drag-allow-from=".vue-draggable-handle"
            drag-ignore-from=".no-drag"
          >
            <component
              :is="widget.component"
              :uuid="widget.i"
              v-bind="widget.properties"
              @add-widget="onAddWidget"
              @remove-widget="onRemoveWidget"
            />
          </grid-item>
        </grid-layout>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

import { GridLayout, GridItem } from 'vue-grid-layout'
import Widget from 'components/Widget.vue'
import TableWidget from 'components/TableWidget.vue'
import ImageWidget from 'components/ImageWidget.vue'
import TextWidget from 'components/TextWidget.vue'
import ChartWidget from 'src/components/ChartWidget.vue'
import FlowGraphWidget from 'components/FlowGraphWidget.vue'
import MapWidget from 'components/MapWidget.vue'
import IdeWidget from 'components/IdeWidget.vue'
import TodoWidget from 'components/TodoWidget.vue'
import ListWidget from 'components/ListWidget.vue'
import FormWidget from 'components/FormWidget.vue'

import { Node as ReteNode } from 'rete'

import axios from 'axios'

interface Widget {
  i: string,
  x: number,
  y: number,
  w: number;
  h: number;
  movable: boolean;
  component: string;
  properties?: {};
}

interface View {
  id: string,
  name: string,
  widgets: [Widget]
}

interface ServerResponse {
  data: View
}

@Component({
  name: 'MainLayout',

  components: {
    GridLayout,
    GridItem,
    Widget,
    TableWidget,
    ImageWidget,
    TextWidget,
    FlowGraphWidget,
    ChartWidget,
    IdeWidget,
    MapWidget,
    TodoWidget,
    ListWidget,
    FormWidget
  }
})
export default class MainLayout extends Vue {
  draggable = true;
  resizable = true;
  colNum = 12;
  index = 0;

   layout: View | null = null;

  /** Calls the server backend to receive the layout json file */
  private loadLayout () {
    axios.request<View>({
      url: 'http://localhost:8000/view/load/123',
      transformResponse: (r: ServerResponse) => r.data
    }).then((response) => {
      this.layout = JSON.parse(response.request.response)
    })
  }

  private saveLayout () {
    console.log(this.layout)
    axios.post('http://localhost:8000/view/save', this.layout)
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  async mounted () {
    await this.loadLayout()
  }

  getWidgetName (element: string) {
    return `${element.charAt(0).toUpperCase()}${element.slice(1)}Widget`
  }

  onAddWidget (element: ReteNode) {
    const properties = {}
    if (element.name === 'TextFilter') {
      return
    }

    console.log(element.name)
    const layout = (this.layout as View)
    layout.widgets.push({
      i: `${element.data.uuid}`,
      x: 6,
      y: layout.widgets.length + (this.colNum || 12), // puts it at the bottom
      w: 2,
      h: 4,

      movable: false,
      properties: properties,
      component: this.getWidgetName(element.name)
    })
    this.index++
  }

  onRemoveWidget (id: string) {
    const index = this.layout?.widgets.findIndex((widget : Widget) => widget.i === id)

    if (index !== -1) {
      this.layout?.widgets.splice(index as number, 1)
    }
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

.vue-grid-item .resizing {
    opacity: 0.9;
}

/*
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
*/
.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

</style>
