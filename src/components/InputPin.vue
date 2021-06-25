<template>
  <div class="row">
    <Socket
      v-socket:input="pin"
      type="input"
      :socket="pin.socket"
      :used="pin.connections.length > 0"
      class="col-12 col-md-auto"
    />

    <div class="col input-title" v-show="!pin.showControl()">
      {{ pin.name }}
    </div>

    <div
      class="col input-control"
      v-show="pin.showControl()"
      v-control="pin.control"
    ></div>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'

import { Input } from 'rete';
import Socket from 'components/Socket.vue'
import Mixin from 'src/plugins/rete-vue/mixin'

export default defineComponent({
    components: {
        Socket
    },

    props: {
        pin: Object as PropType<Input>
    },

    mixins: [
        Mixin
    ]
})
</script>

<style lang="scss" scoped>
.input-title {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 1em;
}
</style>