# Plotly

실시간 차트를 구현하면서, 여러 차트 라이브러리를 사용해보고 있다.
 
그중에서 plotly로 vue에서 실시간 차트를 구현해봤다.

우선 라이브러리를 다운받는다.

```
$ npm i plotly.js-dist vue-plotly 
```

chart.js와 다르게 x축 범위를 직접 지정해줘야 한다.

```
<template>
  <Plotly :data="chartData" :layout="chartLayout" :display-mode-bar="false" />
</template>

<script lang="ts">
import Vue from "vue";
import { Plotly } from "vue-plotly";

function getFakeData() {
  return Math.floor(Math.random() * 100) + 1;
}
export default Vue.extend({
  name: "PlotlyChart",
  components: { Plotly },
  props: {
    chartValue: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      chartData: [
        {
          x: [new Date()],
          y: [getFakeData()],
          mode: "lines",
        },
        {
          x: [new Date()],
          y: [getFakeData()],
          mode: "lines",
        },
        {
          x: [new Date()],
          y: [getFakeData()],
          mode: "lines",
        },
      ] as any[],
      chartLayout: {
        title: "Test",
        xaxis: {
          type: "date",
          range: [0, 0],
          fixedrange: true,
        },
        yaxis: {
          fixedrange: true,
        },
      } as any,
    };
  },
  watch: {
    chartValue() {
      const time = new Date();

      this.chartData.forEach((chart: any) => {
        chart.x = [...chart.x, time];
        chart.y = [...chart.y, getFakeData()];
      });

      const olderTime = time.setSeconds(time.getSeconds() - 15);
      const futureTime = time.setSeconds(time.getSeconds() + 15);

      this.chartLayout.xaxis.range = [olderTime, futureTime];
    },
  },
});
</script>
```
