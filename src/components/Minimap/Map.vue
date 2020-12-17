<template>
  <div class="minimap" :class="mapClass()">
    <div class="area" ref="area" @mousedown.stop.prevent="">
      <div
        class="mini-node"
        v-for="node in nodes"
        :style="nodeStyle(node)"
      ></div>
      <div class="mini-viewport" ref="viewport" :style="viewportStyle()"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { drag } from "./Drag";
import { nodesBBox } from "./Utils";

export default {
  props: ["size", "nodes", "views", "view"],
  data() {
    return {
      transform: { ox: 0, oy: 0, scale: () => 1, invert: () => 1 }
    };
  },
  mounted() {
    drag(
      this.$refs.viewport,
      () => {
        return { ...this.view.area.transform };
      },
      (dx, dy, initial) => {
        let { x, y, k } = initial;
        let { invert } = this.transform;

        this.view.area.translate(x + k * invert(dx), y + k * invert(dy));
      }
    );
    this.updateTransform();
  },
  watch: {
    size() {
      this.updateTransform();
    }
  },
  methods: {
    mapClass() {
      return {
        [this.size]: true
      };
    },
    updateTransform() {
      let { left, top, width, height } = nodesBBox(this.nodes, this.nv);
      let space = Math.max(2000, Math.max(width, height));
      let w = this.$refs.area.clientWidth;
      let h = this.$refs.area.clientHeight;
      let ox = (space - width) / 2 - left;
      let oy = ((space * h) / w - height) / 2 - top;
      this.transform = {
        scale: v => v * (w / space),
        invert: v => v / (w / space),
        ox,
        oy
      };
    },
    px(v) {
      return v + "px";
    },
    nv(node) {
      return this.views.get(node).el;
    },
    nodeStyle(node) {
      let { ox, oy, scale } = this.transform;
      return {
        left: this.px(scale(ox + node.position[0])),
        top: this.px(scale(oy + node.position[1])),
        width: this.px(scale(this.nv(node).clientWidth)),
        height: this.px(scale(this.nv(node).clientHeight))
      };
    },
    viewportStyle() {
      let { ox, oy, scale } = this.transform;
      let { x, y, k } = this.view.area.transform;
      let width = this.view.container.clientWidth;
      let height = this.view.container.clientHeight;

      return {
        left: this.px(scale(ox - x / k)),
        top: this.px(scale(oy - y / k)),
        width: this.px(scale(width / k)),
        height: this.px(scale(height / k))
      };
    }
  }
};
</script>

<style lang="scss">
.minimap {
    position: absolute;
    right: 24px;
    bottom: 24px;
    padding: 20px;
    overflow: hidden;
    border: 1px solid $secondary;
    background: rgba($secondary, 0.3);
    border-radius: 2px;
}

.small {
        width: 150px;
        height: 150px;
}

.middle {
        width: 220px;
        height: 220px;
}
.large {
            width: 300px;
        height: 300px;
}
    .area {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .mini-node {
        position: absolute;
        background: rgba($primary, 0.8);
    }
    .mini-viewport {
        position: absolute;
        background: rgba($secondary, 0.3);
        border: 1px solid $secondary;
    }
</style>
