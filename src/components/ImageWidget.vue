<template>
<Widget title="Image">
        <q-img
          src="https://placeimg.com/500/300/nature"
          :ratio="1"
        />
</Widget>
</template>

<script lang="ts">
import Widget from './Widget.vue'
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'ImageWidget',

    components: {
      Widget
    }
})
export default class ImageWidget extends Vue {    
}
</script>

<style lang="scss">
</style>