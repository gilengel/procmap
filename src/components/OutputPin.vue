lines (37 sloc)  798 Bytes
  
<template>
  <div class="row">
    <div class="output-title col">{{ pin.name }}</div>

    <Socket
      v-socket:input="pin"
      type="output"
      :socket="pin.socket"
      :used="pin.connections.length > 0"
      class="col-12 col-md-auto"
    />
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
.row {
  width: 100%;
  justify-content: space-between;
}
.output-title {
  display: flex;
  align-items: center;
  padding-left: 1em;
}
</style>