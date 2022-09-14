# Vue-meta

Vue는 SPA라서 meta 태그를 작성하고 싶을 경우, 별도의 라이브러리를 사용해야한다.

meta 정보는 html head에 들어가야하는 정보를 담는데, 보통 검색 엔진 최적화를 위해서 해당 페이지에 대한 설명을 작성한다.

아래 명령어로 라이브러리를 다운받는다.

```
$ npm i vue-meta
```

main.ts(js)에 라이브러리 사용을 할 수 있게 등록해준다.

main.ts
```
import Meta from "vue-meta";

Vue.use(Meta, {
  attribute: "data-vue-meta",
});
```

그리고 원하는 페이지에 meta 정보를 작성하면 된다.

Home.vue
```
import Vue from "vue";
export default Vue.extend({
  metaInfo: {
    title: "Home",
    meta: [
      { charset: "utf-8" },
      {
        vmid: "description",
        name: "description",
        content: "This is home page.",
      },
    ],
  },
}
```

페이지 title도 변경이 잘 되고, 개발자 도구를 열어서 html 요소를 검사해보면 content도 잘 들어가있다.
