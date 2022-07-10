# Computed & Watch

methods에 있는 함수는 그때마다 같은 연산을 반복해서 처리한다. 하지만 같은 값을 반환하는 경우, 같은 연산을 계속해서 처리하는건 효율적이지 않다. 

```
<template>
  <div>
    <input type="number" v-model.number="num1" @keyup="sum"> + 
    <input type="number" v-model.number="num2" @keyup="sum"> = 
    {{result}}
    {{result}}
    {{result}}
  </div>
</template>
<script>
export default {
  data() {
    return {
      num1: 0,
      num2: 0,
      result: 0,
    }
  },
  methods: {
    sum() {
      this.result = this.num1 + this.num2;
    }
  }
}
</script>
```

## Computed

Computed를 사용하면 값을 캐싱할 수 있다. data에 변경이 일어나면 반영해서 값을 캐싱하고 새로운 data field를 만들어준다.

```
<template>
  <div>
    <input type="number" v-model.number="num1"> + 
    <input type="number" v-model.number="num2"> = 
    {{result}}
  </div>
</template>
<script>
export default {
  data() {
    return {
      num1: 0,
      num2: 0,
    }
  },
  computed: {
    result() {
      return this.num1 + this.num2;
    }
  }
}
</script>
```

## Watch

Watch를 사용하면 기존의 data에 값을 캐싱할 수 있다.

```
<template>
  <div>
    <input type="number" v-model.number="num1"> + 
    <input type="number" v-model.number="num2"> = 
    {{result}}
  </div>
</template>
<script>
export default {
  data() {
    return {
      num1: 0,
      num2: 0,
      result: 0,
    }
  },
  watch: {
    num1() {
      this.result = this.num1 + this.num2;
    },
    num2() {
      this.result = this.num1 + this.num2;
    }
  }
}
</script>
```

## Computed와 Watch

Watch는 어떤 값이 바뀌었을 때, 특정 함수를 실행시키거나 하는 등에 사용한다.

간단한 연산을 할 때는 watch 보단 computed 사용하는게 낫다.
