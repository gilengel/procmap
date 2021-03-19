<template>
  <div
    class="socket"
    :class="[type, socket.name, used ? 'used' : ''] | kebab"
    :title="socket.name+'\\n'+socket.hint"
  />
  <!-- Hello World -->
</template>

<script lang="ts">
/* eslint @typescript-eslint/no-explicit-any: off */
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Socket extends Vue {
  @Prop() readonly type!: any;
  @Prop() readonly socket!: any;
  @Prop() readonly used!: boolean;
}
/*
export default Vue.extend({
  props: ['type', 'socket', 'used']
})
*/
</script>

<style lang="scss">
$socket-size: 16px;
$socket-margin: 10px;
.socket {
  display: inline-block;
  cursor: pointer;
  border: 2px solid white;
  border-radius: $socket-size/2.0;
  width: $socket-size;
  height: $socket-size;
  margin: $socket-margin !important;
  vertical-align: middle;
  background: transparent;
  position: relative;
  z-index: 2;
}
.used {
  background: white;
}
.socket:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  top: $socket-size/4-1px;
  left: $socket-size;
  display: inline-block;
  border-style: solid;
  border-width: $socket-size/4 0 $socket-size/4 $socket-size/6;
  border-color: transparent transparent transparent white;
}
.socket:hover {
  border: 2px solid #777;
}
.socket.multiple {
  border-color: yellow;
}
</style>
