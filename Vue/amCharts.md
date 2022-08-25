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
        maxDeviation: 0.5,
        extraMin: -0.1,
        extraMax: 0.1,
        groupData: false,
        baseInterval: { timeUnit: "second", count: 1 },
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

    // 시리즈
    this.series = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 1",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );
    this.series2 = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 2",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );
    this.series3 = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 3",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );
    this.series4 = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 4",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );
    this.series5 = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 5",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );
    this.series6 = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 6",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );
    this.series7 = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 7",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );
    this.series8 = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 8",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );
    this.series9 = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 9",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );
    this.series10 = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 10",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );
    this.series11 = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 11",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );
    this.series12 = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 12",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );
    this.series13 = chart.series.push(
      am5xy.LineSeries.new(root, {
        minBulletDistance: 10,
        name: "Series 13",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );

    function generateChartData() {
      var chartData = [];
      var firstDate = new Date();
      firstDate.setDate(firstDate.getDate() - 1000);

      for (var i = 0; i < 50; i++) {
        var newDate = new Date(firstDate);
        newDate.setSeconds(newDate.getSeconds() + i);

        chartData.push({
          date: newDate.getTime(),
          value: Math.floor(Math.random() * 100) + 1,
        });
      }
      return chartData;
    }

    let data = generateChartData();
    let data2 = generateChartData();
    let data3 = generateChartData();
    let data4 = generateChartData();
    let data5 = generateChartData();
    let data6 = generateChartData();
    let data7 = generateChartData();
    let data8 = generateChartData();
    let data9 = generateChartData();
    let data10 = generateChartData();
    let data11 = generateChartData();
    let data12 = generateChartData();
    let data13 = generateChartData();

    this.series.data.setAll(data);
    this.series2.data.setAll(data2);
    this.series3.data.setAll(data3);
    this.series4.data.setAll(data4);
    this.series5.data.setAll(data5);
    this.series6.data.setAll(data6);
    this.series7.data.setAll(data7);
    this.series8.data.setAll(data8);
    this.series9.data.setAll(data9);
    this.series10.data.setAll(data10);
    this.series11.data.setAll(data11);
    this.series12.data.setAll(data12);
    this.series13.data.setAll(data13);

    this.series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: undefined,
        sprite: am5.Circle.new(root, {
          radius: 0,
        }),
      });
    });

    let cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        xAxis: this.xAxis,
      })
    );
    cursor.lineY.set("visible", false);

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
        this.addData(this.series);
        this.addData(this.series2);
        this.addData(this.series3);
        this.addData(this.series4);
        this.addData(this.series5);
        this.addData(this.series6);
        this.addData(this.series7);
        this.addData(this.series8);
        this.addData(this.series9);
        this.addData(this.series10);
        this.addData(this.series11);
        this.addData(this.series12);
        this.addData(this.series13);
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
