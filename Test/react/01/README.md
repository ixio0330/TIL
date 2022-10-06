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
