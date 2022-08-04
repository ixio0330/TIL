# 재사용성 높이기

공통 컴포넌트 개발을 위해 사용되는 개념들이다.

## slot

slot을 사용하면 컴포넌트를 추상화시킬 수 있다.

name에 slot의 이름을 설정해준다. 만약 name을 적지 않으면, default로 설정된다.

**Modal Layout Component**
```
<template>
  <div class="modal">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
<script>
export default {
  name: 'ModalLayout',
}
</script>
```

ModalLayout로 감싸고, template에 v-slot:name을 적어 원하는 곳에 컴포넌트를 위치키실 수 있다.

**Confirm Modal Component**
```
<template>
  <ModalLayout>
    <template v-slot:header>
      <p>Header</p>
    </template>
    <template v-slot:default>
      <p>Main (default)</p>
    </template>
    <template v-slot:footer>
      <p>Footer</p>
    </template>
  </ModalLayout>
</template>
<script>
import ModalLayout from './ModalLayout.vue'
export default {
  name: 'ConfirmModal',
  components: {
    ModalLayout
  },
}
</script>
<style scoped>
</style>
```

## provide/inject

컴포넌트 간에는 props나 emit으로 데이터, 이벤트 등을 전달할 수 있다. 하지만 컴포넌트가 중첩되면 중첩될수록 데이터를 전달하기 쉽지 않다.

그래서 vue에서는 provide, inject를 제공한다.

**최상위 컴포넌트**
```
<template>
  <div>
    <ChildComponent />
  </div>
</template>
<script>
import ChildComponent from './PropsChild.vue'
export default {
  name: 'Parent',
  components: { ChildComponent },
  data() {
    return {
      title: '최상위 컴포넌트'
    }
  },
  provide() {
    return {
      title: this.title,
    }
  }
}
</script>
```

**중간 컴포넌트**
```
<template>
  <div>
    <LastChildVue />
  </div>
</template>
<script>
import LastChildVue from './LastChild.vue'
export default {
  name: 'Child',
  components: {
    LastChildVue
  }
}
</script>
```

**최하위 컴포넌트**
```
<template>
  <div>
    {{ title }}
  </div>
</template>
<script>
export default {
  name: 'Last Child',
  inject: ['title']
}
</script>
```

## mixins

많은 컴포넌트에서 공통적으로 사용되는 함수는 mixins으로 관리해서 사용할 수 있다.

Api 통신을 하는 함수를 mixins.js 파일로 따로 저장한다. 컴포넌트 내에서 동일한 이름의 함수가 있을 경우 충돌이 날 수 있으므로, 이런 문제를 방지하기 위해 prefix($)를 이용한다.

**mixins.js**
```
export default {
  methods: {
    $api(url, options) {
      return fetch(url, options)
        .then((res) => res.json())
        .catch(console.log);
    },
  },
};
```

mixins을 import해와서 mixins에 배열로 넣어준다. 그러면 mixins.js에 있던 함수들이 컴포넌트의 methods에 전부 들어간다.

컴포넌트의 methods에 선언한 함수를 사용하는 것과 같이 사용하면 된다.

**mixin 사용**
```
<template>
  <div>
    <button @click="getTodos">get todos</button>
  </div>
</template>
<script>
import mixins from '@/mixins';
export default {
  mixins: [ mixins ],
  methods: {
    getTodos() {
      this.$api('https://jsonplaceholder.typicode.com/todos/1', {
        method: 'GET',
        'Content-Type': 'application/json',
      }).then(console.log);
    }
  },
}
</script>
```

### App에 mixin 주입

하지만 매번 mixin을 import하는 것이 번거로울 수 있다. 그럴 경우에는 vue app에 주입해서 사용할 수 있다.

**main.js**
```
import { createApp } from 'vue';
import App from './App.vue';
import mixins from './mixins';

createApp(App).mixin(mixins).mount('#app');
```

**mixin 사용**
```
<template>
  <div>
    <button @click="getTodos">get todos</button>
  </div>
</template>
<script>
export default {
  methods: { 
    getTodos() {
      this.$api('https://jsonplaceholder.typicode.com/todos/1', {
        method: 'GET',
        'Content-Type': 'application/json',
      }).then(console.log);
    }
  },
}
</script>
```

mixin은 공통 함수를 관리할 수 있지만, 불필요한 함수가 병합되어버려서 무거운 컴포넌트를 양산할 수 있다는 문제점도 있다.

## Composition Api

Composition Api는 Vue3에서 가장 중요한 내용이다. mixin과 마찬가지로 재사용성을 높이기 위한 것이며, 공통 함수를 사용할 수 있다.

사용자에게 숫자 두 개를 입력받아 결과를 출력하는 Counter 컴포넌트다.

**Counter Component**
```
<template>
  <div>
    <input type="text" v-model.number="num1" @keyup="sum"> + 
    <input type="text" v-model.number="num2" @keyup="sum"> = 
    {{result}}
</div>
</template>
<script>
export default {
  name: 'Composition Api',
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
  },
}
</script>
```

**Composition api를 사용한 Counter Component**
```
<template>
  <div>
    <input type="text" v-model.number="countState.num1"> + 
    <input type="text" v-model.number="countState.num2"> = 
    {{countState.result}}
</div>
</template>
<script>
import { reactive, computed } from 'vue';
export default {
  name: 'Composition Api',
  setup() { 
    let countState = reactive({
      num1: 0,
      num2: 0,
      result: computed(() => countState.num1 + countState.num2)
    });

    return {
      countState,
    }
  },
}
</script>
```

**외부에 선언된 함수를 사용해 Composition api 사용하기**
```
<template>
  <div>
    <input type="text" v-model.number="num1"> + 
    <input type="text" v-model.number="num2"> = 
    {{result}}
</div>
</template>
<script>
import { reactive, computed, toRefs } from 'vue';
function sum() {
  let state = reactive({
    num1: 0,
    num2: 0,
    result: computed(() => state.num1 + state.num2)
  });

  return toRefs(state);
}

export default {
  name: 'Composition Api',
  setup() { 
    let { num1, num2, result } = sum();

    return { num1, num2, result }
  },
}
</script>
```

## Composition Api provide & inject

```
<template>
  <div>
    <LastChildVue />
  </div>
</template>
<script>
import LastChildVue from './LastChild.vue';
import { provide } from 'vue';
export default {
  name: 'Composition Api',
  components: {
    LastChildVue
  },
  setup() { 
    provide('title', 'composition api를 통해 provide 사용하기');
  },
}
</script>
```

**LastChild.vue**
```
<template>
  <div>
    {{ title }}
  </div>
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'Last Child',
  setup() {
    const title = inject('title');
    return { title };
  }
}
</script>
```
