<template>
  <div class="row">
    <div class="col" @contextmenu="showMenu($event)">1</div>
    <div class="col">2</div>
    <div class="col">3</div>

    <q-menu
      v-model="menuVisible"
      anchor="top left"
      self="top left"
      :offset="menuOffset"
    >
      <q-list style="width: 200px">
        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon color="primary" name="las la-columns" />
          </q-item-section>

          <q-item-section>Split</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon color="primary" name="las la-trash" />
          </q-item-section>

          <q-item-section>Delete</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: "LayoutColumn",
})
export default class LayoutColumn extends Vue {
  menuVisible = false;
  value = 0;

  menuOffset = [0, 0];

  showMenu(e: MouseEvent) {
    e.preventDefault();

    const parentBoundingBox = (e.target as HTMLElement).getBoundingClientRect();
    Vue.set(this.menuOffset, 0, -(e.clientX - parentBoundingBox.x) + 100);
    Vue.set(this.menuOffset, 1, -(e.clientY - parentBoundingBox.y) + 16);

    this.menuVisible = true;
  }
}
</script>

<style lang="scss" scoped>
.row {
  height: 100%;

  .col {
    border: solid 1px salmon;
    transition: background 0.3s;
  }

  .col:hover {
    background: rgba(salmon, 0.4);
  }
}
</style>
