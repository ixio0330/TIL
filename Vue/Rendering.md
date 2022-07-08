# Vue의 렌더링

Vue에서는 렌더링 문법이 존재한다.

## v-if, v-else-if, v-else

v-if는 조건이 true인 경우에만 렌더링을 한다. javascript if 조건문과 작동 방식이 같다.

```
<template>
  <div>
    <p v-if="admin">Admin</p>
    <p v-else-if="member">Member</p>
    <p v-else>Guest</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      admin: false,
      member: true,
      guest: false,
    }
  },
}
</script>
```

## v-show

v-show는 조건이 true인 경우에만 렌더링 한다. v-if와 다르게 하나씩만 사용 가능하다. 

```
<template>
  <div>
    <p v-show="modal">Modal</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      modal: true,
    }
  },
}
</script>
```

### v-if와 v-show

v-if는 조건이 true인 경우에만 DOM에 렌더링 된다. 반면 v-show는 조건에 상관없이 DOM에 렌더링이 되고, 조건이 false인 경우에는 display:none;으로 설정해서 화면에서 보여지지 않도록 한다.

따라서 v-if는 자주 사용되지 않는 경우에 사용하고, v-show는 자주 보였다가 사라지는 modal창과 같은 경우에 사용하는게 좋다.

## v-for

```
<template>
  <div>
    <p v-for="(product, index) in productList" :key="index">
      {{product}}
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      productList: ['모니터', '마우스', '키보드'],
    }
  },
}
</script>
```
