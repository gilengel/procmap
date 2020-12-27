<template>
  <div>
    <q-toolbar class="bg-black text-white">
      <q-toolbar-title> Message Log </q-toolbar-title>
    </q-toolbar>

    <ul>
      <!--
      <template v-for="item in messages">
        <li
          :key="item.date"
          :class="{
            error: item.level == 0,
            warning: item.level == 1,
            info: item.level == 2,
            success: item.level == 3,
          }"
        >
          {{ item.message }}
        </li>
      </template>
      -->
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

import { Message } from '../store/messages'

@Component
export default class MapEditorComponent extends Vue {
  @Getter('MessageModule/allMessages') messages: Array<Message>;
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;

  color: white;

  > .warning {
    color: orange;
  }
}
</style>
