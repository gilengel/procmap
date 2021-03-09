<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <grid-layout
          :layout.sync='layout'
          :col-num='12'
          :row-height='30'
          :is-draggable='true'
          :is-resizable='true'
          :vertical-compact='true'
          :use-css-transforms='true'
          :margin='[0, 0]'
        >
          <grid-item
            v-for='item in layout'
            :static='item.static'
            :x='item.x'
            :y='item.y'
            :w='item.w'
            :h='item.h'
            :i='item.i'
            :key="item.i"
          >

            <component 
              :is='item.component' 
              :ref='item.component + item.i'
              @add-widget='onAddWidget'  
            >
            </component> 
          </grid-item>
        </grid-layout>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { defineComponent } from '@vue/composition-api'
//import MapEditorComponent from 'components/MapEditorComponent.vue'

import { GridLayout, GridItem } from 'vue-grid-layout';
import Widget from 'components/Widget.vue'
import TableWidget from 'components/TableWidget.vue'
import ImageWidget from 'components/ImageWidget.vue'
import FlowGraphWidget from 'components/FlowGraphWidget.vue'

import Vue from 'vue'

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export default defineComponent({
  name: 'MainLayout',

  components: {
    GridLayout,
    GridItem,
    Widget,
    TableWidget,
    ImageWidget,
    FlowGraphWidget
  },

  data() {
    return {
      layout: [      
        { x: 0, y: 0, w: 6, h: 16, i: '0', static: true, component: 'FlowGraphWidget' },

        //{ x: 9, y: 0, w: 3, h: 8, i: '3', static: false, component: 'Widget' },
        //{ x: 9, y: 8, w: 3, h: 8, i: '4', static: false, component: 'Widget' },

      ],
      draggable: true,
      resizable: true,
      colNum: 12,
      index: 0,
    };
  },
  
  mounted() {
    this.index = this.layout.length;
  }, 

  methods: {
    onAddWidget(element: string) { 
      var ComponentClass = null;  
           
        if(element === 'table') {
          ComponentClass = Vue.extend(TableWidget)


              //this.$refs['Widget1'].appendChild(instance.$el)          
        }else if(element === 'image') {
          ComponentClass = Vue.extend(ImageWidget)
        }

        if(ComponentClass === null) {
          return;
        }
              
        //var instance = new ComponentClass()
        //instance.$mount() // pass nothing

        let len = this.$data.layout.length;
        this.layout.push({
                              x: 6,
                              y: this.layout.length + (this.colNum || 12), // puts it at the bottom
                              w: 2,
                              h: 6,
                              i: `${this.index}`,
                              static: false,
                              component: (element as String).capitalize() + 'Widget'
        });
              
        this.index++;
    },

    itemTitle(item) {
      let result = item.i;
      if (item.static) {
        result += ' - Static';
      }
      return result;
    },
  },
});
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
</style>
