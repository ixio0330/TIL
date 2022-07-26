# 데이터 전달

컴포넌트간에는 데이터를 전달하고, 이벤트를 발생시킬 수 있다.

## props

props는 부모 컴포넌트에서 자식 컴포넌트에게 데이터를 전달할 때 사용한다.

title이라는 데이터를 전달받아 출력하는 HeaderTitle 컴포넌트이다.

**Child Component**
```
<template>
  <div>
    <p>{{ title }}</p>
  </div>
</template>
<script>
export default {
  name: 'HeaderTitle',
  props: {
    title: {
      type: String,
      default: 'Title',
    }
  }
}
</script>
```

HeaderTitle 컴포넌트를 사용하기 위한 상위 컴포넌트다. HeaderTitle를 import 한 후, components에 등록해서 사용한다.

title이라는 props를 넘겨야하는데, 만약 넘기지 않으면 HeaderTitle에서 title에 설정한 default 값이 출력된다.

**Parent Component**
```
<template>
  <div>
    <HeaderTitle title="타이틀 입니다." />
  </div>
</template>
<script>
import HeaderTitle from './HeaderTitle.vue'
export default {
  name: 'Parent',
  components: {HeaderTitle},
}
</script>
```

부모 컴포넌트에 있는 데이터를 넘기고 싶다면, v-bind:를 사용한다. 만약 type에 맞지 않게 문자열을 제외한 다른 타입의 데이터를 보내면 오류가 난다.

```
<template>
  <div>
    <HeaderTitle :title="parentTitle" />
  </div>
</template>
<script>
import HeaderTitle from './HeaderTitle.vue'
export default {
  name: 'Parent',
  components: {HeaderTitle},
  data() {
    return {
      parentTitle: 'Title'
    }
  }
}
</script>
```

## ref

ref는 부모 컴포넌트에서 자식 컴포넌트를 참조해서 원하는 것을 할 수 있다.

ref를 사용해서 할 수 있는 것
1. 부모 컴포넌트에서 자식 컴포넌트의 데이터 변경하기
2. 부모 컴포넌트에서 자식 컴포넌트의 메소드 실행시키기
3. 부모 컴포넌트에서 자식 컴포넌트의 이벤트 발생시키기

### 데이터 변경하기

childData를 출력하는 자식 컴포넌트이다. 

**Child Component**
```
<template>
  <div>
    <p>{{ childData }}</p>
  </div>
</template>
<script>
export default {
  name: 'Child',
  data() {
    return {
      childData: 'Child Data'
    }
  },
}
</script>
```

부모 컴포넌트에서 자식 컴포넌트를 사용할 때, ref로 자식 컴포넌트의 참조 값을 설정해주면 자식 컴포넌트의 데이터에 접근이 가능하다.

**Parent Component**
```
<template>
  <div>
    <HeaderTitle ref="header_title" />
    <button @click="changeChildData">Change Child Data</button>
  </div>
</template>
<script>
import HeaderTitle from './HeaderTitle.vue'
export default {
  name: 'Parent',
  components: { HeaderTitle },
  methods: {
    changeChildData() {
      // header_title를 참조해서 childData를 변경
      this.$refs.header_title.childData = 'Changed by parent.';
    }
  }
}
</script>
```

### 메소드 실행시키기

child 버튼을 클릭하면 콘솔창에 Hello를 출력하는 자식 컴포넌트이다. 

**Child Component**
```
<template>
  <div>
    <button @click="sayHello">child</button>
  </div>
</template>
<script>
export default {
  name: 'Child',
  methods: {
    sayHello() {
      console.log('Hello');
    }
  }
}
</script>
```

데이터 변경하는 방법과 같이 자식 컴포넌트에 ref를 설정하고, 자식 컴포넌트 함수에 접근해서 실행시킨다.

**Parent Component**
```
<template>
  <div>
    <HeaderTitle ref="header_title" />
    <button @click="excuteChildFunction">Excute Child Function</button>
  </div>
</template>
<script>
import HeaderTitle from './HeaderTitle.vue'
export default {
  name: 'Parent',
  components: { HeaderTitle },
  methods: {
    excuteChildFunction() {
      this.$refs.header_title.sayHello();
    },
  }
}
</script>
```

### 이벤트 발생시키기

child 버튼을 클릭하면 콘솔창에 Hello를 출력하는 자식 컴포넌트이다. button에 ref를 설정해놨다.

**Child Component**
```
<template>
  <div>
    <button ref="child_button" @click="sayHello">child</button>
  </div>
</template>
<script>
export default {
  name: 'Child',
  methods: {
    sayHello() {
      console.log('Hello');
    }
  }
}
</script>
```

메소드 실행하는 방법과 같이 자식 컴포넌트에 ref를 설정하고, 자식 컴포넌트의 button ref에 접근해서 click 이벤트를 발생시킨다.

**Parent Component**
```
<template>
  <div>
    <HeaderTitle ref="header_title" />
    <button @click="excuteChildEvent">Excute Child Event</button>
  </div>
</template>
<script>
import HeaderTitle from './HeaderTitle.vue'
export default {
  name: 'Parent',
  components: { HeaderTitle },
  methods: {
    excuteChildEvent() {
      this.$refs.header_title.$refs.child_button.click();
    },
  }
}
</script>
```

## emit

emit을 사용하면 자식 컴포넌트에서 부모 컴포넌트로 데이터와 이벤트를 전달할 수 있다.

click 이벤트가 발생하면 부모에게 send-message라는 이벤트로 자신에게 있던 message 데이터를 전달하는 자식 컴포넌트다.

**Child Component**
```
<template>
  <div>
    <button @click="sendMessageToParent">send to parent</button>
  </div>
</template>
<script>
export default {
  name: 'Child',
  data() {
    return {
      message: 'Message from child',
    }
  },
  methods: {
    sendMessageToParent() {
      this.$emit('send-message', this.message);
    }
  }
}
</script>
```

send-message 이벤트가 발생하면, message를 받아서 콘솔 창에 출력한다.

**Parent Component**
```
<template>
  <div>
    <ChildComponent @send-message="bringMessageFromChild" />
  </div>
</template>
<script>
import ChildComponent from './ChildComponent.vue'
export default {
  name: 'Parent',
  components: { ChildComponent },
  methods: {
    bringMessageFromChild(message) {
      console.log(message);
    }
  }
}
</script>
```
