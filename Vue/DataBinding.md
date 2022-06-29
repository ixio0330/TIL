# 데이터 바인딩

Vue는 양방향 데이터 바인딩을 지원한다. 데이터 바인딩을 할 때 {{ }}를 사용한다.  

```
<template>
  <div>
    {{ message }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: 'Hello Vue.js!',
    }
  },
}
</script>
```

## 원시 HTML 데이터 바인딩

{{}}를 사용해서 원시 html을 바인딩 시키면, 문자열 그대로가 나타난다.

```
<template>
  <div>
    {{ html }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      html: '<p>Hello Vue.js !</p>',
    }
  },
}
</script>
```

원시 html을 바인딩 시킬 상위 태그에서 v-html=""를 사용해야 원시 html 바인딩이 가능하다.

```
<template>
  <div v-html="html"></div>
</template>
<script>
export default {
  data() {
    return {
      html: '<p>Hello Vue.js !</p>',
    }
  },
}
</script>
```

## 입력폼 데이터 바인딩

input 값에 v-model을 사용하면 데이터 바인딩이 가능하다.

### input

각 input마다 v-model과 연결되는 기본 값이 있다.

#### text

text에서 v-model은 value 속성과 연결된다.

```
<template>
  <div>
    <input type="text" v-model="message">
    <p>message: {{message}}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: '',
    }
  },
}
</script>
```

#### number

number에서 v-model은 value 속성과 연결된다.

기본적으로 input에 담기는 값은 문자열이기 때문에, 연산을 할때 parseInt나 Number로 형변환을 해줘야하는데 v-model.number을 사용하면 형변환을 알아서 해준다.

```
<template>
  <div>
    <input type="text" v-model.number="number">
  </div>
</template>
<script>
export default {
  data() {
    return {
      number: 0,
    }
  },
}
</script>
```

#### checkbox

checkbox에서 v-model은 checked 속성과 연결된다. 

```
<template>
  <div>
    <label>human? <input type="checkbox" v-model="isHuman" /></label>
    <p>{{isHuman}}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isHuman: false,
    }
  },
}
</script>
```

여러 개의 checkbox가 있을 경우, checked가 true인 checkbox의 value를 담는 배열을 사용할 수 있다.

```
<template>
  <div>
    <p>좋아하는 과일을 선택해주세요.</p>
    <label>딸기 <input type="checkbox" v-model="checkedFruits" value="strawberry"></label>
    <label>포도 <input type="checkbox" v-model="checkedFruits" value="grape"></label>
    <label>키위 <input type="checkbox" v-model="checkedFruits" value="kiwi"></label>
    <label>사과 <input type="checkbox" v-model="checkedFruits" value="apple"></label>
    <p>{{checkedFruits}}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkedFruits: [],
    }
  },
}
</script>
```

#### radio

radio v-model은 checked 속성과 연결된다. checked가 true인 value가 바인딩 된다.

```
<template>
  <div>
    <label>iPhone <input type="radio" value="iPhone" v-model="smartPhone"></label>
    <label>Galaxy <input type="radio" value="Galaxy" v-model="smartPhone"></label>
    <p>smartPhone: {{smartPhone}}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      smartPhone: '',
    }
  },
}
</script>
```

### textarea

textarea에서 v-model은 value 속성과 연결된다. input text와 사용법이 같다.

```
<template>
  <div>
    <textarea v-model="textareaModel"></textarea>
    <p>{{textareaModel}}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      textareaModel: '',
    }
  },
}
</script>
```

### select & option

select & option에서 v-model은 option의 selected 속성과 연결된다. 

option의 selected가 true인 value가 바인딩 된다.

```
<template>
  <div>
    <select v-model="selectModel">
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
}
</script>
```

## 속성(attribute)에 데이터 바인딩

속성에 v-bind:를 사용하면 속성에 데이터 바인딩이 가능하다. 속성에 data를 넣으면 문자열이 그대로 들어간다.

```
<template>
  <div>
    <a href="google">Google</a>
  </div>
</template>
<script>
export default {
  data() {
    return {
      google: 'https://www.google.com/'
    }
  },
}
</script>
```

### href

v-bind:를 사용해야 data가 바인딩 되며, v-bind는 생략 가능하며 :href=""로 입력하면 된다.

```
<template>
  <div>
    <a v-bind:href="google">Google</a>
    <a :href="google">Google</a>
  </div>
</template>
<script>
export default {
  data() {
    return {
      google: 'https://www.google.com/'
    }
  },
}
</script>
```

### style

v-bind:style=""를 사용해서 inline 스타일을 바인딩할 수 있다. 안에 들어가는 데이터는 객체여야 한다.

```
<template>
  <div :style="divStyle">
    Inline style Binding
  </div>
</template>
<script>
export default {
  data() {
    return {
      divStyle: {
        backgroundColor: '#ddd',
        color: 'blue',
        fontSize: '20px'
      }
    }
  },
}
</script>
```

### class

v-bind:class=""를 사용해서 객체로 {'class명': 조건}을 넣으면 된다. 조건이 true일 경우 class가 바인딩 된다.

```
<template>
  <div :class="{'divStyle': isDivStyle}">
    class binding
  </div>
</template>
<script>
export default {
  data() {
    return {
      isDivStyle: true,
    }
  },
}
</script>
<style>
.divStyle {
  background-color: #ddd;
  color: blue;
  font-size: 20px;
}
</style>
```
