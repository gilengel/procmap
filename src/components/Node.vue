<template>
  <div :class="[selected(), 'node shadow-4']">
    <div class="title">
      {{ node.name }}
      <q-btn
        flat
        round
        :color="node.data.preview ? 'primary' : ''"
        :icon="node.data.preview ? 'las la-video' : 'las la-video-slash'"
        @click="togglePreview"
      />
      <!--v-show="node.data.preview == true || node.data.preview == false"-->
    </div>
    <q-separator dark inset />
    <div class="content">
      <div
        class="column inputs"
        v-if="node.controls.size > 0 || node.inputs.size > 0"
      >
        <div v-for="input in inputs()" :key="input.name" class="input">
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
        <div class="output" v-for="output in outputs()" :key="output.name">
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

    <q-linear-progress dark class="q-mt-sm" size="8px" :value="node.data.progress" v-if="node.data.working"/>

  </div>
</template>

<script lang="ts">
import VueRender from 'rete-vue-render-plugin'
import Socket from './Socket.vue'

import { Component, Mixins } from 'vue-property-decorator'
import { NodeEditor, Node as ReteNode } from 'rete'

@Component({
  components: {
    Socket: Socket
  }
})
export default class Node extends Mixins(VueRender.mixin) {
  editor: NodeEditor | undefined
  node: ReteNode | undefined

  togglePreview () {
    if (this.editor === undefined || this.node === undefined) {
      return
    }

    this.editor.trigger('previewnode', this.node)

    this.node.data.preview = !this.node.data.preview

    this.$forceUpdate()
  }
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
$socket-size: 16px;
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
  min-height: 200px;
  //box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .content {
    display: flex;
    flex-grow: 2;
    padding-top: 20px;
    //

    .node-column {
      //display: flex;
      //flex-direction: row;
      align-items: center;
      align-content: space-between;

      //border: solid 1px green;

      .control {
        padding-left: 8px;
        padding-right: 8px;
      }
    }
  }
}

.input, .output {
  padding-right: 6px;
  display: flex;
  align-items: center;

  color: white;
}

.ouptut {
  padding-left: 6px;
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
  padding: 8px;
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

  display: flex;
  flex-direction: column;

  div {
    display: flex;
  }
}

.outputs {
  text-align: right;
}
/*
.input-title,
.output-title {
  vertical-align: middle;
  color: white;
  display: inline-block;
  margin: $socket-margin 0;
  line-height: $socket-size;
}
.input-control {
  z-index: 1;
  vertical-align: middle;
  display: inline-block;
}

.control {
  width: 100%;
  padding: $socket-margin $socket-size/2 + $socket-margin;
}
*/
</style>
