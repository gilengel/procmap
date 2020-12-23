<template>
  <div>
    <div ref="graph"></div>
  <q-input
    style="max-width: 120px"
    dark
    dense
    filled
    value="x^2"
    type="text"
    @input="change"
  />
  </div>
</template>

<script lang="ts">
import { NodeEditor } from 'rete'

import { Vue, Component, Prop } from 'vue-property-decorator'

// mport functionPlot from 'function-plot'

@Component
export default class FunctionControl extends Vue {
  value = 20;

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
    /*
    const graphElement = this.$refs.graph as HTMLElement
    const contentsBounds = graphElement.getBoundingClientRect()

    const width = 300
    const height = 300
    const ratio = contentsBounds.width / width
    // width *= ratio;
    // height *= ratio;

    functionPlot({
      target: graphElement,
      width,
      height,
      yAxis: { domain: [-256, 256] },
      xAxis: { domain: [-256, 256] },
      grid: true,
      disableZoom: true,
      data: [
        {
          fn: '-x^2',
          derivative: {
            fn: '2 * x',
            updateOnMouseMove: false
          }
        }
      ]
    })
    */

    /*
    const property = (this.getData as (v: string) => unknown)(this.ikey as string) as number

    if(property === undefined) {
      throw new Error(`could not set value for number control since the property with key ${this.ikey} is not specified as data on the node`)
    }

    this.value = property
    */
  }
}
</script>

<style lang="scss">
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
