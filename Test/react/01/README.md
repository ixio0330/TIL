# React Test

[따라하며 배우는 리액트 테스트](https://www.inflearn.com/course/%EB%94%B0%EB%9D%BC%ED%95%98%EB%8A%94-%EB%A6%AC%EC%95%A1%ED%8A%B8-%ED%85%8C%EC%8A%A4%ED%8A%B8/dashboard) 강의를 보면서 배운 내용을 기록했습니다.

## Jest 자동완성 기능

CRA로 앱을 구성해도 jest 자동완성은 안된다. 그래서 아래 명령어로 타입을 다운받아준다.

```
$ npm i -D @types/jest
```

그리고 jsconfig 파일을 root 폴더에 추가한다.

jsconfig.json
```
{
  "typeAcquisition": {
    "include": [
      "jest"
    ]
  }
}
```

vscode를 종료했다가 다시 실행시키면 자동완성 기능이 된다.

## 테스트를 코드를 작성하는 이유

1. 디버깅 시간을 단축할 수 있다. 자동화 된 유닛 테스팅으로 특정 버그를 찾아낼 수 있다.
2. 안정적인 어플리케이션이 된다.
3. 재설계 시간 단축, 추가로 구현할 때 더 용이하다.

## React Testing Library

React Testing Library는 DOM Testing Library 위에 구축된다.
* DOM Testing Library이란 Dom 노드를 테스트하기 위한 매우 가벼운 솔루션이다.

React Testing Library는 컴포넌트를 테스트하는 가벼운 솔루션이다.
사용자 입장에 포커스를 맞추는 행위 주도 테스트 (Behavior Driven Test) 방식이다.

## Eslint Plugin 설치

```
$ npm i -D eslint-plugin-testing-library eslint-plugin-jest-dom
```

.eslintrc.json
```
{
  "plugins": [
    "testing-library",
    "jest-dom"
  ],
  "extends": [
    "react-app",
    "react-app/jest",
    "plugin:testing-library/react",
    "plugin:jest-dom/recommended"
  ]
}
```

## TDD (Test Driven Development)

테스트 코드 작성 -> 테스트 실행 Fail -> 실제 코드 작성 -> 테스트 실행 Pass

1. 소스 코드에 안정감이 생긴다.
2. 디버깅 시간이 단축되고 개발 시간이 단축된다.
3. 클린 코드가 나올 확률이 높다.
