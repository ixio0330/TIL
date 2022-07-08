# 이벤트 처리

v-on: 를 사용하면 이벤트 처리가 가능하다. v-on은 @로 대체할 수 있다.

### click

button이 클릭되어 이벤트가 발생하면 함수가 실행된다.

```
<template>
  <div>
    <button type="button" v-on:click="onClick">click</button>
  </div>
</template>
<script>
export default {
  methods: {
    onClick() {
      console.log('click!');
    }
  }
}
</script>
```

### change

option을 선택해서 selectModel이 변경되는 이벤트가 발생하면 함수가 실행된다.

```
<template>
  <div>
    <select v-model="selectModel" @change="onChange">
      <option value="seoul">서울</option>
      <option value="busan">부산</option>
    </select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectModel: '',
    }
  },
  methods: {
    onChange() {
      console.log(this.selectModel);
    }
  }
}
</script>
```

### key

key 이벤트는 keydown, keyup, keypress가 있다. 

```
<template>
  <div>
    <input type="text" v-model="textModel" @keydown="onKey">
  </div>
</template>
<script>
export default {
  data() {
    return {
      textModel: '',
    }
  },
  methods: {
    onKey() {
      console.log(this.textModel);
    }
  }
}
</script>
```

특정 키인 enter를 눌렀을 때만 이벤트를 발생시키고 싶다면 v-on:keydown.enter를 사용하면 된다.

```
<template>
  <div>
    <input type="text" v-model="textModel" @keydown.enter="onKey">
  </div>
</template>
<script>
export default {
  data() {
    return {
      textModel: '',
    }
  },
  methods: {
    onKey() {
      console.log(this.textModel);
    }
  }
}
</script>
```

## 두 개 이상의 함수 실행

한 번의 이벤트에 두 개 이상의 함수를 실행시키고 싶다면 함수를 실행시키는 형태로 넘겨주면 된다.

```
<template>
  <div>
    <button @click="sayHello(), sayBye()" type="button">click</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      textModel: '',
    }
  },
  methods: {
    sayHello() {
      console.log('Hello');
    },
    sayBye() {
      console.log('Bye');
    }
  }
}
</script>
```
