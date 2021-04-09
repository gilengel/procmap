<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>Page Builder</q-toolbar-title>
        </q-toolbar>
        <div class="row">
          <div class="col-2">
            <q-list dark bordered separator draggable>
              <q-item
                draggable
                @dragstart="startDrag($event, element)"
                :key="element.id"
                v-for="element in pageElements"
              >
                <q-item-section avatar>
                  <q-icon color="white" :name="element.icon" />
                </q-item-section>

                <q-item-section>{{element.label}}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-10 drop-zone" @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
              <LayoutColumn v-for="i in rows + 1" />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
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
    LayoutColumn,
  },
})
export default class UiBuilderLayout extends Vue {
    rows: number = 0;
  pageElements = [
    {
      id: "column",
      label: "Column",
      icon: "las la-table",
      defaultData: {},
    },
  ];

  startDrag(evt: DragEvent, item: MetaFlowComponent) {
    console.log(evt);
    if (evt.dataTransfer === null) {
      return;
    }

    evt.dataTransfer.dropEffect = "move";
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("itemId", item.id);

    //console.log(item);
  }

  onDrop(evt: DragEvent) {
    if (evt.dataTransfer === null) {
      return;
    }
    const itemId = evt.dataTransfer.getData("itemId");

    console.log(itemId);

    this.rows += 1;
  }
}
</script>

<style lang='scss' scoped>
</style>
