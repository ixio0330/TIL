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

## 시도했던 방법

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
