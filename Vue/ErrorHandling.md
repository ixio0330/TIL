# Vue Error Handling

Vue에서는 컴포넌트 내부에서 에러를 감지해서 처리하는 방법과 전역으로 에러 처리하는 방법이 있다.

## errorCaptured 사용하기

errorCaptured를 사용하면 자식 컴포넌트를 포함한 컴포넌트 내부에서 발생한 에러를 관리할 수 있다.

React에서 Error boundary를 사용하는 것처럼 Vue에서도 errorCaptured를 사용해서 Error boundary 컴포넌트를 만들어서 사용할 수 있다.

ErrorBoundary.vue
```
<template>
  <div class="template-error">
    <slot></slot>
    <div v-show="isError" class="modal-error">
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
      <button @click="isError = false">close</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "ErrorBoundary",
  data() {
    return {
      isError: false,
      title: "Error Ttitle",
      content: "Error Content",
    };
  },
  errorCaptured(err, vm, info) {
    this.isError = true;
    this.title = err.name;
    this.content = err.message;
  },
});
</script>

<style scoped>
.template-error {
  position: relative;
}
.modal-error {
  border: 1px solid #ddd;
  width: 200px;
  padding: 20px;
  position: fixed;
  top: calc(50% - 80px);
  left: calc(50% - 100px);
}
</style>
```

## Vue.config.errorHandler 사용하기

main.ts(js)에서 전역 에러 핸들러를 커스텀해서 사용할 수 있다.

main.ts
```
Vue.config.errorHandler = (err) => {
  // 전역 Error 처리
  return;
};
```

Vue에서 발생하는 모든 error는 errorHandler로 전달되기 때문에 errorHandler 함수를 커스텀해서 사용하면 된다.
