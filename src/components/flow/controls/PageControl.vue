<template>
  <div>
    <q-select
      dark
      filled
      :value="model"
      use-input
      hide-selected
      hide-bottom-space
      dense
      fill-input
      input-debounce="0"
      :options="options"
      @filter="filterFn"
      @input-value="setModel"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script lang="ts">
import { NodeEditor } from "rete";
import ToggleButton from "../ToggleButton.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { evaluate } from "mathjs";

const stringOptions = [
  "Google",
  "Facebook",
  "Twitter",
  "Apple",
  "Oracle",
].reduce((acc, opt) => {
  for (let i = 1; i <= 5; i++) {
    acc.push(opt + " " + i);
  }
  return acc;
}, []);

@Component
export default class PageControl extends Vue {
  @Prop(NodeEditor) emitter: NodeEditor | undefined;
  @Prop(String) ikey: string | undefined;
  @Prop(Function) getData: unknown;
  @Prop(Function) putData: unknown;
  @Prop({
    type: Function,
    default: () => {
      return true;
    },
  })
  isValid!: undefined;

  x = 512;

  y = 512;

  options = stringOptions;
  model = null;

  linked = false;

  filterFn(val, update, abort) {
    update(() => {
      const needle = val.toLocaleLowerCase();
      this.options = stringOptions.filter(
        (v) => v.toLocaleLowerCase().indexOf(needle) > -1
      );
    });
  }

  setModel(val) {
    this.model = val;
  }
}
</script>

<style lang="scss">
.linked-control {
  display: flex;
  flex-direction: row;
  > .inputs {
  }
  > .link {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  $width: 8px;
  > .link:before {
    left: 50%;
    transform: translateX(-$width);
    top: $width;
    bottom: calc(50% + #{$width * 1.5});
    width: $width;
    border-right: 1px solid white;
    border-top: 1px solid white;
    position: absolute;
    content: "";
  }
  > .link:after {
    left: 50%;
    transform: translateX(-$width);
    bottom: $width;
    top: calc(50% + #{$width * 1.5});
    width: $width;
    border-right: 1px solid white;
    border-bottom: 1px solid white;
    position: absolute;
    content: "";
  }
  > .highlight:before {
    border-right: 1px solid $primary;
    border-top: 1px solid $primary;
  }
  > .highlight:after {
    border-right: 1px solid $primary;
    border-bottom: 1px solid $primary;
  }
}
</style>
