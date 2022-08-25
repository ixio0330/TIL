# amCharts

amCharts를 사용해서 실시간 차트를 구현했다. 직접 데이터를 지워주는 로직을 추가해야한다.

```
$ npm i @amcharts/amcharts regenerator-runtime
```

amCharts는 많은 기능을 제공하는 만큼 다양한 커스터마이징이 가능해서 러닝커브가 높다고 한다.

```
<template>
  <div>
    <h3>amChart Chart</h3>
    <button @click="start">start</button>
    <button @click="stop">stop</button>
    <div class="amChart" ref="amChart"></div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "core-js/stable";
import "regenerator-runtime/runtime";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default Vue.extend({
  data() {
    return {
      chart: null as any,
      intervalKey: 0,
      xAxis: null as any,
      yAxis: null as any,
      allSeries: [] as any[],
    };
  },
  mounted() {
    let root = am5.Root.new(this.$refs.amChart);
    root.setThemes([am5themes_Animated.new(root)]);

    // Chart option
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        wheelY: "zoomX",
      })
    );

    // X축 option
    this.xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.3,
        extraMin: -0.1,
        extraMax: 0.1,
        groupData: false,
        baseInterval: { timeUnit: "millisecond", count: 100 },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    // Y축 option
    this.yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    for (let i = 1; i <= 20; i++) {
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          minBulletDistance: 10,
          name: `Series ${i}`,
          xAxis: this.xAxis,
          yAxis: this.yAxis,
          valueYField: "value",
          valueXField: "date",
          legendValueText: "{valueY}",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{valueY}",
          }),
        })
      );
      this.allSeries.push(series);
    }

    function generateChartData() {
      var chartData = [];
      var firstDate = new Date();
      firstDate.setDate(firstDate.getDate() - 1000);

      for (var i = 0; i < 50; i++) {
        var newDate = new Date(firstDate);
        newDate.setSeconds(newDate.getSeconds() + i);

        chartData.push({
          date: newDate.getTime(),
          value: 0,
        });
      }
      return chartData;
    }

    this.allSeries.forEach((series: any) => {
      series.data.setAll(generateChartData());
    });

    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    var legend = chart.rightAxesContainer.children.push(
      am5.Legend.new(root, {
        width: 150,
        paddingLeft: 15,
        height: am5.percent(100),
      })
    );

    legend.itemContainers.template.events.on("pointerover", function (e) {
      var itemContainer = e.target;

      var series = itemContainer?.dataItem?.dataContext;

      chart.series.each(function (chartSeries) {
        if (chartSeries != series) {
          chartSeries.strokes.template.setAll({
            strokeOpacity: 0.15,
            stroke: am5.color(0x000000),
          });
        } else {
          chartSeries.strokes.template.setAll({
            strokeWidth: 3,
          });
        }
      });
    });

    legend.itemContainers.template.events.on("pointerout", function (e) {
      chart.series.each(function (chartSeries) {
        chartSeries.strokes.template.setAll({
          strokeOpacity: 1,
          strokeWidth: 1,
          stroke: chartSeries.get("fill"),
        });
      });
    });

    legend.data.setAll(chart.series.values);

    chart.appear(1000, 0);

    this.chart = chart;
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    addData(series: any) {
      var lastDataItem = series.dataItems[series.dataItems.length - 1];
      var newValue = Math.floor(Math.random() * 100) + 1;
      var lastDate = new Date(lastDataItem.get("valueX"));
      var time = am5.time.add(new Date(lastDate), "second", 1).getTime();
      series.data.removeIndex(0);
      series.data.push({
        date: time,
        value: newValue,
      });
    },
    interval() {
      const intervalKey = setInterval(() => {
        this.allSeries.forEach((series: any) => {
          this.addData(series);
        });
      }, 100);
      this.intervalKey = intervalKey;
    },
    start() {
      this.interval();
    },
    stop() {
      clearInterval(this.intervalKey);
    },
  },
});
</script>
<style scoped>
.amChart {
  width: 100%;
  height: 600px;
}
</style>
```
