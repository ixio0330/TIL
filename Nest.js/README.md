# 들어가며...

express로 개발을 하는데 아키텍처 설계를 못하니까 단순히 mvc모델을 따라서 하려다가,, 구조가 깔끔하지 못해서 데이터 흐름을 파악하기 힘들었다.

그러던 중 express를 기반으로 한 프레임워크인 nest.js를 알게되었고, nest.js에 대해 공부한 내용을 기록할 예정이다.

# Nest.js

**모듈 - 컨트롤러 - 서비스** 구조

- main.ts

프로젝트 엔트리 파일. 몇 번 포트에서 서버를 개방할지, 어떤 모듈이나 미들웨어를 사용할지 정의한다.

- [moduel-name].module.ts

api 모듈을 관리하는 파일.

- [moduel-name].controller.ts

api 엔드포인트를 관리하는 파일.

- [moduel-name].service.ts

api 비즈니스 로직을 관리하는 파일.

## 구조 도식화

┌─ main.ts ───────────────────────────────────────────────────────────────────────────┐
│┌─ appModule.ts ────────────────────────────────────────────────────────────────────┐│
││┌──── weatherModule.ts ────┐ ┌──── noticeModule.ts ────┐ ┌──── quoteModule.ts ────┐││
│││   weatherController.ts   │ │   noticeController.ts   │ │   quoteController.ts   │││
│││    weatherService.ts     │ │     noticeService.ts    │ │     quoteService.ts    │││
││└──────────────────────────┘ └─────────────────────────┘ └────────────────────────┘││
│└───────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘

### WeatherController

Controller는 api 엔드포인트를 관리한다.
Api에는 method에 맞게 들어온 요청을 처리한다.

```
@Get()
getWeather(): string {
  return "today's weather info";
}

// Get 인자로 받은 인자명과 getWeatherByDay의 Param명이 같아야 한다.
@Get('/:day')
getWeatherByDay(@Param('day') _day: string): string {
  return DAY[_day] ? `${DAY[_day]}'s weather info` : 'Error.';
}

// 만약 이렇게 되면 uri를 제대로 받아오지 못한다.
@Get('/:today')
getWeatherByDay(@Param('day') _day: string): string {
  return DAY[_day] ? `${DAY[_day]}'s weather info` : 'Error.';
}
```

### WeatherService

서비스는 컨트롤러에서 실행할 함수의 비즈니스 로직을 정의하는 부분이다.
서비스를 사용할 때는 먼저 컨트롤러에 해당 서비스를 등록해야 한다.

## Nest 구성요소

"nest -h" 명령어를 쳐보면, nest 구성요소를 생성하는 명령어들을 확인할 수 있다.

"nest g [Schematics] [ModuleName]"

### 오류 발생

"nest g resource Weather" 명령어로 Weather module, service, controller를 생성했는데, 아래 오류가 났다.

```
ERROR [ExceptionHandler] Nest can't resolve dependencies of the WeatherController (?). Please make sure that the argument WeatherService at index [0] is available in the AppModule context.

Potential solutions:
- If WeatherService is a provider, is it part of the current AppModule?
- If WeatherService is exported from a separate @Module, is that module imported within AppModule?   
  @Module({
    imports: [ /* the Module containing WeatherService */ ]
  })
```

컨트롤러의 종속성을 해결할 수 없다는 문구였는데, nest 구조를 정확히 이해 못했던 상황에서 마주한 에러는 나를 당황스럽게 했다.

찾아보니, AppModule의 controllers 배열에 WeatherController가 들어있는게 문제였다.

app.module.ts 파일에 controllers에 있던 WeatherController는 삭제해주고, weather.module.ts 파일에 controllers에 WeatherController를 추가했다.

**app.module.ts**
```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [WeatherModule],
})
export class AppModule {}
```

**weather.module.ts**
```
import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';

@Module({
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
```

각 모듈은 알아서 controller, service를 주입해주고, app.module.ts 파일에 imports에만 사용할 각 모듈을 넣어주면 되는 것 같다.
