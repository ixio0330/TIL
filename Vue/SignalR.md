# SignalR

Vue와 SignalR을 사용해서 실시간 채팅, 실시간 데이터 송신 등을 구현했다.

## 실시간 채팅

실시간 채팅을 구현한 예시이다.

### Frontend (Vue)

Vue에서 SignalR을 사용하기 위해서는 먼저 아래 모듈을 설치해야 한다.

@types/node는 타입스크립트를 사용하는 경우에만 설치하면 된다.

```
$ npm i @microsoft/signalr
$ npm i -D @types/node
```

SignalR을 사용해서 실시간 채팅을 간단하게 구현했다.

먼저, signalR 모듈을 불러와서 connection을 설정해준다. chatHub 허브를 구독하고, 컴포넌트가 생성되는 시점에서 연결을 한다.

ChatView.vue

```
<script lang="ts">
import * as signalR from "@microsoft/signalr";
import Vue from "vue";
export default Vue.extend({
  name: "ChatView",
  data() {
    return {
      connection: new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/chatHub`, { // cors 문제로 설정한 옵션 객체
          skipNegotiation: true, 
          transport: signalR.HttpTransportType.WebSockets,
        })
        .build(),
      user: "",
      message: "",
      messageList: [] as string[],
    };
  },
  methods: {
    start() {
      this.connection
        .start()
        .then(() => {
          console.log("Start connection");
        })
        .catch((error: any) => {
          console.log(error);
        });
    },
    on() {
      this.connection.on("ReceiveMessage", (user: string, message: string) => {
        const encodeMessage = `[${user}] ${message}`;
        this.messageList.push(encodeMessage);
      });
    },
    sendMessage() {
      if (!this.user || !this.message) {
        console.log("user, message not allowed empty.");
        return;
      }
      this.connection.invoke("SendMessage", this.user, this.message);
    },
  },
  created() {
    this.start();
    this.on();
  },
});
</script>
```

SendMessage는 hub 클래스에 있는 public 함수이며, 이 함수가 호출되면 ReceiveMessage로 모든 사용자에게 메시지를 뿌려준다.

### Backend (Asp.net core)

먼저 Asp.net core Web api 앱을 설치한다. 

설치한 프로젝트에 추가 -> 클라이언트 쪽 라이브러리 -> 공급자(provider)를 unpkg로 설정하고 signalR을 설치한다.

설치가 되면 Hubs 폴더를 생성하고, ChatHub.cs 파일을 추가한다.

ChatHub.cs

```
using Microsoft.AspNetCore.SignalR;

namespace SignalR_app.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
```

그리고 Program.cs 파일을 수정한다.

Program.cs

```
using SignalR_app.Hubs;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<TimerManager>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SignalR 사용 설정
builder.Services.AddSignalR();

// Cors 사용 설정
builder.Services.AddCors();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS 설정
app.UseCors(config =>
{
    config.AllowAnyOrigin();
    config.AllowAnyMethod();
    config.AllowAnyHeader();
});

// ChatHub 추가
app.MapHub<ChatHub>("/chatHub");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
```

그리고 프로그램을 실행시키면 된다.

## 실시간 데이터 전송

실시간으로 데이터를 받아서 차트를 그리는 예시이다.

실시간 데이터 전송은 서버에서 어떤 방식으로 데이터를 전송하는지에 따라 달라질 것 같은데, 나는 controller 사용해서 데이터를 전송하도록 했다.

### Frontend (Vue)

먼저 차트를 사용하기 위해 chart.js를 설치해준다.

```
$ npm i chart.js vue-chartjs
```

라인 차트 컴포넌트를 만들어준다. Chart.js에서 real-time을 지원해주는지 조사중인데 아직 확인이 안되서, 우선은 data와 label을 삭제하고 넣어주는 방식으로 구현했다.

LineChart.vue

```
<template>
  <LineChartGenerator
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Line as LineChartGenerator } from "vue-chartjs/legacy";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default Vue.extend({
  components: {
    LineChartGenerator,
  },
  name: "LineChart",
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    chartValue: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      chartData: {
        labels: [
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
          "00:00:00",
        ],
        datasets: [
          {
            label: "SiganlR real-time data",
            backgroundColor: "seagreen",
            borderColor: "seagreen",
            lineTension: 0.3,
            data: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
      } as ChartOptions,
    };
  },
  methods: {
    getTime() {
      return new Date().toTimeString().slice(0, 8);
    },
  },
  watch: {
    chartValue() {
      this.chartData.labels.splice(0, 1);
      this.chartData.labels.push(this.getTime());
      this.chartData.datasets[0].data.splice(0, 1);
      this.chartData.datasets[0].data.push(this.chartValue);
    },
  },
});
</script>
```

이제 실시간으로 데이터를 받아와서 라인 차트에 props로 넘겨주도록 하면 된다.

ChartView.vue

```
<template>
  <div>
    <button @click="start">start</button>
    <button @click="stop">stop</button>
    <LineChart :chartValue="chartValue" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as signalR from "@microsoft/signalr";
import LineChart from "@/components/LineChart.vue";
export default Vue.extend({
  name: "SignalR",
  components: {
    LineChart,
  },
  data() {
    return {
      connection: new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/chartHub`, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .build(),
      chartValue: 0,
    };
  },
  methods: {
    connect() {
      this.connection
        .start()
        .then(() => {
          console.log("Start connection");
        })
        .catch((error: any) => {
          console.log(error);
        });
    },
    receiveChartData() {
      this.connection.on("TransferChartData", (data: number) => {
        this.chartValue = data;
      });
    },
    fetchApi() {
      fetch(`${baseUrl}/chart`)
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    },
    start() {
      console.log("start");
      this.receiveChartData();
      this.fetchApi();
    },
    stop() {
      console.log("stop");
      this.connection.off("TransferChartData");
    },
  },
  created() {
    this.connect();
    this.start();
  },
  destroyed() {
    this.stop();
  },
});
</script>
```

connection.on을 하고도 api를 호출해줘야 하는데, 이건 서버에서 controller를 사용해서 실시간 데이터를 전송해주기 때문에 이렇게 했다.

### Backend (Asp.net core)

Hubs폴더에 ChartHub.cs 파일을 만든다.

ChartHub.cs

```
using Microsoft.AspNetCore.SignalR;

namespace SignalR_app.Hubs
{

    public class ChartHub : Hub
    {
    }
}
```

이번에는 hub에 아무런 메소드도 없는데, controller에서 IHubContext 인터페이스를 사용하기 때문이다.

Manager 폴더를 만들고 TimerManager.cs, DataManager.cs 파일을 만든다.

TimerManager.cs

```
namespace SignalR_app.Manager
{
    public class TimerManager
    {
        private Timer? _timer;
        private AutoResetEvent? _autoResetEvent;
        private Action? _action;
        public DateTime TimerStarted { get; set; }
        public bool IsTimerStarted { get; set; }
        public void PrepareTimer(Action action)
        {
            _action = action;
            _autoResetEvent = new AutoResetEvent(false);
            _timer = new Timer(Execute, _autoResetEvent, 0, 100);
            TimerStarted = DateTime.Now;
            IsTimerStarted = true;
        }
        public void Execute(object? stateInfo)
        {
            _action();
        }
    }
}
```

DataManager.cs

```
namespace SignalR_app.Manager
{
    public class DataManager
    {
        public static int GetData()
        {
            var r = new Random();
            return r.Next(1, 100);
        }
    }
}
```

그리고 Controllers폴더에 ChartController.cs 파일을 만든다.

ChartController.cs
```
using Microsoft.AspNetCore.Mvc;
using SignalR_app.Manager;
using SignalR_app.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace SignalR_app.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChartController : ControllerBase
    {
        private readonly IHubContext<ChartHub> _hub;
        private readonly TimerManager _timer;

        public ChartController(IHubContext<ChartHub> hub, TimerManager timer)
        {
            _hub = hub;
            _timer = timer;
        }
        [HttpGet]
        public IActionResult Get()
        {
            if (!_timer.IsTimerStarted)
                _timer.PrepareTimer(() => _hub.Clients.All.SendAsync("TransferChartData", DataManager.GetData()));
            return Ok(new { Message = "Request Completed" });
        }
    }
}
```

이제 Program.cs에서 ChartHub를 등록해주면 된다.

Program.cs

```
using SignalR_app.Hubs;
using SignalR_app.Manager;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<TimerManager>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddCors();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(config =>
{
    config.AllowAnyOrigin();
    config.AllowAnyMethod();
    config.AllowAnyHeader();
});

// chartHub 등록
app.MapHub<ChartHub>("/chartHub");

app.MapHub<ChatHub>("/chatHub");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
```
