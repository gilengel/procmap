<template>
  <div style="padding: 5em; height: 300px">
    <LayoutColumn :editable="true" />
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import { GridLayout, GridItem } from "vue-grid-layout";
import LayoutColumn from "components/ui_builder/LayoutColumn.vue";

@Component({
  name: "MainLayout",

  components: {
    GridLayout,
    GridItem,
    LayoutColumn
  },
})
export default class UiBuilderLayout extends Vue {

}
</script>

<style lang='scss' scoped>

</style>
