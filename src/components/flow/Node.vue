<template>
  <div :class="[selected(), 'node shadow-4']">
    <div class="title">
      {{ node.name }}
    </div>
    <div class="content">
      <div
        class="column inputs"
        v-if="node.controls.size > 0 || node.inputs.size > 0"
      >
        <div v-for="input in inputs()" :key="input.name" class="input-container">
          <!-- Pin -->
          <Socket
            v-socket:input="input"
            type="input"
            :socket="input.socket"
            :used="input.connections.length > 0"
          />

          <!-- Pin Name -->
          <div class="input-title" v-show="!input.showControl()">
            {{ input.name }}
          </div>

          <!-- Pin Control -->
          <div
            class="input-control"
            v-show="input.showControl()"
            v-control="input.control"
          ></div>
        </div>
      </div>
      <div class="column">
        <div
          class="control"
          v-for="(control, index) in controls()"
          v-control="control"
          :key="index"
        ></div>
      </div>
      <div class="column outputs">
        <div class="output-container" v-for="output in outputs()" :key="output.name">
            <div class="output-title">{{ output.name }}</div>
            <Socket
              v-socket:output="output"
              type="output"
              :socket="output.socket"
              :used="output.connections.length > 0"
            ></Socket>
        </div>
      </div>
    </div>
<!--
    <q-linear-progress dark class="q-mt-sm" size="8px" :value="node.data.progress" v-if="node.data.progress && Fnode.data.progress != 1.0"/>
-->
  </div>
</template>

<script lang="ts">
import Mixin from 'src/components/flow/plugins/render/Mixin'
import Socket from './Socket.vue'

import { Component } from 'vue-property-decorator'
import { Node as ReteNode } from 'rete'

@Component({
  components: {
    Socket: Socket
  }
})
export default class Node extends Mixin {
  node!: ReteNode
}
</script>

<style lang="scss">
$node-color: rgba(35, 35, 35, 0.7);
$color-active: darken($node-color, 5%);
$title-light: rgba(0, 255, 0, 0.5);
$title-light-transparent: rgba(0, 255, 0, 0);
$group-color: rgba(15, 80, 255, 0.2);
$group-handler-size: 40px;
$group-handler-offset: -10px;
$context-menu-round: 7px;
$socket-size: 10px;
$socket-margin: 10px;

.selected::before {
  display: block;
  content: " ";
  position: absolute;
  z-index: -1;
  border: solid 2px orange;
  border-radius: 2px;

  left: -2px;
  right: -2px;
  top: -2px;
  bottom: -2px;
  //right: 0;
}
.node {
  background: $node-color;
  cursor: pointer;
  height: auto;
  box-sizing: content-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .content {
    display: flex;
    flex-grow: 2;
    padding-top: 20px;
    padding-bottom: 8px;
    //

    .node-column {
      align-items: center;
      align-content: space-between;

      .control {
        padding-left: 8px;
        padding-right: 8px;
      }
    }
  }
}

.input-container, .output-container {
  padding-right: 6px;
  display: flex;
  align-items: center;

  color: white;
}

.ouptut {
  padding-left: 6px;
  justify-content: flex-end;

}

.node:hover {
  background: $node-color;
}
.node:hover.active {
  background: $color-active;
  border: 1px solid #ffd252;
}

.title {
  color: white;
  display: flex;
  line-height: 3em;
  padding-left: 1em;
  overflow: hidden;

  justify-content: space-between;
  align-items: center;

  text-transform: capitalize;
}

.column:not(:last-child) {
  padding-right: 20px;
}

.inputs, .outputs {
  text-align: left;

  //display: flex;
  //flex-direction: column;

}

.outputs {
  align-items: flex-end;
  text-align: right;
}

.node-warning {
  position: absolute;
  top: -2em;
  left: 0;
  right: 0;
  background: orange;

  height: auto;

  padding-left: 1em;
  padding-right: 1em;
  > span {
    font-size: 1em;
    line-height: 2em;
    margin-block-end: 0;
    margin-block-start: 0;

    font-weight: bold;
  }
}

.socket {
  width: $socket-size !important;
  height: $socket-size !important;
}

.socket::after {
  visibility: hidden;
}
</style>
