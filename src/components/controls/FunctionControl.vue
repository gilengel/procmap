<template>
  <div>
    <div ref="graph" class="graph"></div>
    <q-select dark v-model="model" :options="options" label="Standard" />
  </div>
</template>

<script lang="ts">
import { NodeEditor } from 'rete'

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import functionPlot from 'function-plot'

@Component
export default class FunctionControl extends Vue {
  value = 20;

        model= null;
      options= [
        'Smooth', 'Sphere', 'Root', 'Sharp', 'Linear', 'Constant', 'Custom'
      ];

  graphOptions = {}

  @Prop(NodeEditor) emitter: NodeEditor | undefined;
  @Prop(String) ikey: string | undefined;
  @Prop(Function) getData: unknown;
  @Prop(Function) putData: unknown;
  @Prop({
    type: Function,
    default: () => {
      return true
    }
  })
  isValid!: undefined;

  @Watch('model')
  onSelectionChange (newValue) {
    const distance = '(1-abs(-x))'
    switch (newValue) {
      case 'Smooth': {
        this.graphOptions.data[0] = { fn: `3*${distance}^2 - 2*${distance}^3` }
        break
      }
      case 'Sphere': {
        this.graphOptions.data[0] = { fn: `sqrt(${distance}*2 - ${distance}^2)` }
        break
      }
      case 'Root': {
        this.graphOptions.data[0] = { fn: `sqrt(${distance})` }
        break
      }
      case 'Sharp': {
        this.graphOptions.data[0] = { fn: `${distance}^2` }
        break
      }
      case 'Linear': {
        this.graphOptions.data[0] = { fn: '-abs(x) + 1' }

        break
      }
      case 'Constant': {
        this.graphOptions.data[0] = { fn: '1' }
        break
      }
      case 'Custom': {
        break
      }
    }

    functionPlot(this.graphOptions)
  }

  change (e: string) {
    if (!(this.putData instanceof Function)) {
      return
    }

    if (!this.emitter) {
      return
    }

    this.putData(this.ikey, parseInt(e))
    this.emitter.trigger('process')
  }

  mounted () {
    const graphElement = this.$refs.graph as HTMLElement
    const contentsBounds = graphElement.getBoundingClientRect()

    const width = 200 // graphElement.parentElement?.scrollWidth
    const height = 200 // graphElement.parentElement?.scrollHeight
    const ratio = height / width

    this.graphOptions = {
      target: graphElement,
      width,
      height,
      yAxis: { domain: [0, 1.3] },
      xAxis: { domain: [-1, 1] },
      grid: false,
      disableZoom: true,
      data: [
        {
          fn: '1'
        }
      ]
    }

    functionPlot(this.graphOptions)
  }
}
</script>

<style lang="scss">

.graph{
  width: 200px;
  height: 200px;
}

.function-plot {
  .x.axis {
    .tick {
      line {
        // grid's vertical lines
        stroke: white
      }
      text {
          visibility: hidden;
          color: white;
        // x axis labels
      }
    }
    path.domain {
      // d attribute defines the graph bounds
    }
  }

  .y.axis {
    .tick {
      line {
          stroke:white

        // grid's horizontal lines
      }
      text {
        visibility: hidden;
          color: white;
        // y axis labels
      }
    }
    path.domain {
      // d attribute defines the graph bounds
    }
  }
}
</style>
