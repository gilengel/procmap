<template>
  <div class="column option-column">
    <h1 class="text-subtitle1">Connection</h1>
    
     <draggable
        class="q-list q-list--bordered q-list--separator q-list--dark"
        tag="div"
        v-model="list"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
            <q-item clickable v-ripple             
                class="list-group-item"
                v-for="element in list"
                :key="element.order">
                <q-item-section>
                    <i
                    :class="
                        element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
                    "
                    @click="element.fixed = !element.fixed"
                    aria-hidden="true"
                    ></i>
                    {{ element.name }}
                </q-item-section>
            </q-item>          
        </transition-group>
      </draggable>    
      
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import HeadingElement from './TextElement.vue'
import draggable from "vuedraggable";

import { StringTransform } from '../../models/String'

const message = [
  "vue.draggable",
  "draggable",
  "component",
  "for",
  "vue.js 2.0",
  "based",
  "on",
  "Sortablejs"
];

@Component({
  name: 'ConnectionOptions',

  components: {
    draggable,
  },
})
export default class ConnectionOptions extends Vue {
    drag = false

    get list() {
        /*
        let result = []
        for(const transform in StringTransform) {
            console.log(transform)
            result.push(transform)
        }

        return result
        */

       return message.map((name, index) => {
        return { name, order: index + 1 };
      })
    }

    set list(val: string){

    }

    get dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }

    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order);
    }
}
</script>

<style lang="scss" scoped>


</style>
