<template>
  <div>
    <div ref="graph" class="graph"></div>
    <q-select
      dark
      v-model="model"
      :options="options"
      @input="onSelectionChange"
      label="Standard"
    />
  </div>
</template>

<script lang="ts">
import { NodeEditor } from 'rete'

import { Component, Prop, Watch } from 'vue-property-decorator'

import VueFlowControl from '../FlowControl'

import functionPlot from 'function-plot'
import { FunctionPlotOptions } from 'function-plot/dist/types'

@Component
export default class FunctionControl extends VueFlowControl {
  value = 20;

  model = null;
  options = ['Smooth', 'Sphere', 'Root', 'Sharp', 'Linear', 'Constant', 'Custom'];

  graphOptions: FunctionPlotOptions = {
    target: '',
    width: 200,
    height: 200,
    yAxis: { domain: [0, 1.3] },
    xAxis: { domain: [-1, 1] },
    grid: false,
    disableZoom: true,
    data: [
      {
        fn: '1'
      }
    ]
  };

  onSelectionChange (newValue: string) {
    if (this.graphOptions.data && this.graphOptions.data[0]) {
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

      if (
        this.isValid !== undefined &&
        ((this.isValid as unknown) as (e: unknown) => boolean)
      ) {
        this.putData(this.propertyKey, this.graphOptions.data[0].fn)
        this.emitter.trigger('process')
      }

      functionPlot(this.graphOptions)
    }
  }

  mounted () {
    const graphElement = this.$refs.graph as HTMLElement
    // const contentsBounds = graphElement.getBoundingClientRect()

    const width = 200 // graphElement.parentElement?.scrollWidth
    const height = 200 // graphElement.parentElement?.scrollHeight
    // const ratio = height / width

    this.graphOptions = {
      target: (graphElement as unknown) as string,
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
.graph {
  width: 200px;
  height: 200px;
}

.function-plot {
  .x.axis {
    .tick {
      line {
        // grid's vertical lines
        stroke: white;
      }
      text {
        visibility: hidden;
        color: white;
        // x axis labels
      }
    }
  }

  .y.axis {
    .tick {
      line {
        stroke: white;

        // grid's horizontal lines
      }
      text {
        visibility: hidden;
        color: white;
        // y axis labels
      }
    }
  }
}
</style>
