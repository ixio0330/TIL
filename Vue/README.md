# Vue

Inflearn에 있는 [Vue.js 제대로 배워볼래?(Vue.js 프로젝트 투입 일주일 전)](https://www.inflearn.com/course/vue-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EB%B0%B0%EC%9B%8C%EB%B3%B4%EA%B8%B0) 강의를 보고 공부한 내용을 기록합니다.

## Vue 시작하기

Vue 프로젝트는 직접 webpack을 구성해서 만들거나, Vue CLI를 사용해서 생성할 수 있다.

### Vue CLI 설치

Vue CLI를 global로 설치하려면 터미널에 아래 명령어를 입력한다.

```
npm install -g @vue/cli
```

설치가 잘 되었는지 vue-cli 버전을 확인하기 위해서는 아래 명령어를 입력한다.

```
vue --version
```

### Vue 프로젝트 생성

Vue CLI 프로젝트를 생성하는 방법은 세 가지가 있다.

1. Default 옵션
2. Manually select features(사용자 선택) 옵션
3. Vue project manager 이용

### 1. Default 옵션

Vue 프로젝트를 생성할 폴더 경로에서 터미널을 열어서 아래 명령어를 입력한다. vue-default는 프로젝트 이름이기 때문에 원하는 이름을 입력하면 된다.

```
vue create vue-default
```

그러면 아래 결과가 나온다. 어떤 방법으로 vue 프로젝트를 생성할지 고르면 되는데, 맨 위에 있는 Default ([Vue 3] babel, eslint)를 선택한다.

```
Vue CLI v5.0.4
Failed to check for updates
? Please pick a preset: (Use arrow keys)
> Default ([Vue 3] babel, eslint)       
  Default ([Vue 2] babel, eslint)       
  Manually select features
```

Vue project가 생성되고, 해당 프로젝트 폴더 경로에서 npm run serve를 입력해서 프로젝트를 실행시킨다.

### 2. Manually select features(사용자 선택) 옵션

1번과 똑같이 vue create 명령어를 입력한 후, 맨 아래에 있는 Manually select features를 선택한다.

그러면 아래 결과가 나온다. 어떤 옵션을 추가해서 프로젝트를 생성할지 선택할 수 있다.

```
? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
>(*) Babel
 ( ) TypeScript
 ( ) Progressive Web App (PWA) Support
 ( ) Router
 ( ) Vuex
 ( ) CSS Pre-processors
 ( ) Linter / Formatter
 ( ) Unit Testing
 ( ) E2E Testing
```

원하는 옵션을 선택하고 나면 vue project가 생성되고, 해당 프로젝트 폴더 경로에서 npm run serve를 입력해서 프로젝트를 실행시킨다.

### 3. Vue project manager 이용

Vue gui를 사용하는 방법이다. 아래 명령어를 입력하면 http://localhost:8000 페이지가 열린다.

```
vue ui
```

원하는 옵션을 선택해서 프로젝트를 생성하면 된다.

## Vue 컴포넌트 기본구조

Vue는 파일은 .vue 확장자를 사용한다. 기본 구조는 html 코드가 들어가는 template, javascript 코드가 들어가는 script, css 코드가 들어가는 style로 나뉜다.

```
<template>
  <div></div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {
    
    }
  },
  methods: {},
}
</script>

<style>
</style>
```

컴포넌트는 script 태그 안에서 작성하는데, export default로 객체를 내보낸다.

객체 안에는 컴포넌트 이름을 설정하는 name, import 해와서 사용할 컴포넌트들을 담는 components객체, 데이터를 담아둘 data함수, 컴포넌트 내부에서 사용할 함수를 담는 methods 등 컴포넌트에서 사용할 다양한 것들을 설정할 수 있다.
