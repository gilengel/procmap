<template>
    <q-toggle
      v-model="isDark"
      color="primary"
      label="Dark Mode"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';
import { Style } from 'src/models/Style'
/*
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Style } from 'src/store/Style'
import { Getter, Action } from 'vuex-class';
*/
export default defineComponent({

  computed: {
      isDark: {
          get(): boolean {
            const style = this['Style/currentStyle']() as Style

            return style === Style.Dark
          },

          set(newValue: boolean) {
              void this['Style/setStyle'](newValue ? Style.Dark : Style.Light)
          }
      }
  },

  methods: {
      ...mapActions(['Style/setStyle']),
      ...mapGetters(['Style/currentStyle'])
  }


})
</script>

<style lang="scss" scoped>
.widget {
  height: 100%;

  display: flex;
  flex-direction: column;
  //background: rgba($dark-page, 0.9);

}

.widget-content {
  flex-grow: 2;

  height: 100%;
  overflow: hidden;
}

.vue-draggable-handle {
  position: relative !important;
  width: auto !important;
  padding: 0 !important;
}

.custom-handle  {
  font-size: 3em !important;
  color: white;
  margin-right: 6px;
}

span.vue-resizable-handle  {
  visibility: collapse;
}
</style>

