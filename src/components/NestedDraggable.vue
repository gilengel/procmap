<template>
<ul>
  <li>Element 1</li>
  <li>Element 2</li>
  <li>
    <ul>
      <li>Subelement 1</li>
      <li>Subelement 2</li>
      <li>Subelement 3</li>
    </ul>
  </li>
  <li>Element 4</li>
</ul>
<!--
  <draggable class="dragArea" tag="ul" :list="tasks" :group="{ name: 'g1' }">
    <li v-for="el in tasks" :key="el.name">
      <p>{{ el.name }}</p>
      <NestedDraggable :tasks="el.tasks" />
    </li>
  </draggable>
  -->
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import draggable from "vuedraggable";

@Component({
  components: {
    draggable,
  },
})
export default class NestedDraggable extends Vue {
  @Prop()
  tasks: any
}
</script>
<style lang="scss" scoped>

$size: 3em;
ul:first-of-type {
  padding-left: $size;
}
ul {
  list-style: none;
  padding-left: 0;
  position: relative;
}
ul::after {
  content: ' ';
  position: absolute;
  left: $size / 2;
  top: 0;
  width: $size;
  height: calc(100% - #{$size / 2});
  border-left: solid 1px red;
}

li {
  position: relative;
  min-height: $size;
  line-height: $size;
}
li::after {
  content: ' ';
  position: absolute;
  left: -$size / 2;
  top: 50%;
  width: calc(#{$size / 2} - 4px);
  height: 50%;
  border-top: solid 1px red;
}
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}
</style>
