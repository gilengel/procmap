<template>
  <div class="node shadow-4">
    <div class="title">
      {{ node.name }}

      <q-checkbox dark v-model="preview" />
    </div>
    <q-separator dark inset />
    <div class="content">
      <div
        class="node-column row"
        v-if="node.controls.size > 0 || node.inputs.size > 0"
      >
        <div class="inputs" v-for="input in inputs()">
          <div class="input">
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
        <div
          class="control"
          v-for="control in controls()"
          v-control="control"
        ></div>
      </div>
      <div class="node-column">
        <div class="outputs" v-for="output in outputs()">
          <div class="output">
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
    </div>
    <q-linear-progress dark query class="q-mt-sm" />
  </div>
</template>

<script>
import VueRender from "rete-vue-render-plugin";
import Socket from "./Socket";

export default {
  components: {
    Socket
  },

  data() {
    return {
      preview: false
    };
  },

  mixins: [VueRender.mixin]
};
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

.node {
  background: $node-color;
  cursor: pointer;
  height: auto;
  min-height: 200px;
  box-sizing: content-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;


  .content {
    display: flex;
    flex-grow: 2;


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

      .input,
      .output {
        display: flex;
        align-items: center;
        color: white;
      }
    }
  }
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

/*
.inputs {
  text-align: left;
}
*/

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
