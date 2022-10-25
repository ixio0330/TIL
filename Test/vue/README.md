# Vue

기존 프로젝트에 테스트 환경 구성을 하기 위한 방법이다.

Vue2를 기준으로 사용한 방법이며, 기본 옵션인 @vue/test-utils를 사용하지 않고 testing-library를 사용했다.

## 공식문서 권장 방법

```
$ vue add unit-jest
$ npm uninstall @vue/test-utils
$ npm i -D @testing-library/vue@5
$ npm i -D @testing-library/jest-dom
```

test 파일은 root 폴더에 tests 폴더에 작성했다.

## 테스트 코드 작성하기

먼저, 버튼을 클릭하는 숫자를 나타내는 count가 있고, 클릭하면 count가 증가하는 click 버튼이 있는 컴포넌트를 만들었다. 

count가 5 이상이 되면 증가하지 않는 조건도 추가했다.

Counter.vue
```
<template>
  <div>
    <p>Clicked times: <span>{{ count }}</span></p>
    <button @click="increase">click</button>
  </div>
</template>

<script>
export default {
  name: 'Counter',
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increase() {
      if (this.count > 4) return;
      this.count++;
    }
  },
}
</script>
```

이제 테스트 코드를 작성한다.

counter.test.js
```
import { fireEvent, render } from "@testing-library/vue";
import Counter from "@/components/Counter.vue";

describe("<Counter />", () => {
  it('count와 click 버튼이 있다.', () => {
    const { getByText } = render(Counter);
    getByText('0');
    getByText('click');
  });

  it('click 버튼을 누르면 count가 1씩 증가한다.', async () => {
    const { getByText } = render(Counter);
    const count = getByText('0');
    const button = getByText('click');
    await fireEvent.click(button);
    expect(count.textContent).toBe('1');
  });

  it('만약 count가 5 이상이면 증가하지 않는다.', async () => {
    const { getByText } = render(Counter);
    const count = getByText('0');
    const button = getByText('click');
    count.textContent = 5;
    await fireEvent.click(button);
    expect(count.textContent).toBe('5');
  });
});
```

계속 반복되는 코드가 있어서 리팩토링을 했다. setup 함수에 자주 사용되는 count, button 을 담아두고 꺼내쓰도록 했다.

```
import { fireEvent, render } from "@testing-library/vue";
import Counter from "@/components/Counter.vue";

describe("<Counter />", () => {
  const setup = () => {
    const view = render(Counter);
    const count = view.getByText('0');
    const button = view.getByText('click');
    return {
      ...view,
      count,
      button,
    }
  };
  it('count와 click 버튼이 있다.', () => {
    setup();
  });

  it('click 버튼을 누르면 count가 1씩 증가한다.', async () => {
    const { count, button } = setup();
    await fireEvent.click(button);
    expect(count.textContent).toBe('1');
  });

  it('만약 count가 5 이상이면 증가하지 않는다.', async () => {
    const { count, button } = setup();
    count.textContent = 5;
    await fireEvent.click(button);
    expect(count.textContent).toBe('5');
  });
});
```

### React와 Vue의 테스트 방식의 차이

state update
- React : 비동기 처리 없이 변경이 가능하다.
- Vue : 비동기로 처리해야 한다.

```
// React
fireEvent.click(button);

// Vue
await fireEvent.click(button);
```

## 테스트 환경 구성을 시도했던 다른 방법

처음에는 vue add unit-jest라는 cli 명령어가 있는지 몰라서, 직접 수동으로 jest를 설치했었다.

jest 최신버전인 29버전은 다른 모듈들과 종속성 오류가 발생해서 27버전으로 다운받았고, 마지막으로 다운받은 babel-core 모듈은 babel 7버전 이상을 사용하면 다운받아야 된다고 해서 다운받았다.

```
npm i -D jest@27
npm i -D @vue/cli-plugin-unit-jest
npm i -D @vue/vue2-jest@27
npm i -D vue-jest
npm i -D babel-core@^7.0.0-bridge.0
```

설치하고 나서는 jest.config.js 파일로 옵션 설정을 해줘야한다.

jest.config.js
```
const config = {
  preset: "@vue/cli-plugin-unit-jest",
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
  ],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '.*\\.(js)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,vue}',
    '!**/node_modules/**'
  ],
};

module.exports = config;
```

이렇게 jest를 설치하고 나서 testing library를 다운받는 과정에서 오류가 발생해서 찾아보다가 공식문서에서 제공해주는 방법을 사용했고 잘 되었다.

### 참고자료
https://v1.test-utils.vuejs.org/installation/
