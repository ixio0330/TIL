# Custom Directive & Plugins

## Custom Directive

```
<template>
  <div>
    <input type="text" v-focus />
  </div>
</template>
<script>
export default {
  directives: {
    // component 내부에서만 사용 가능한 상태
    focus: {
      mounted(el) {
        el.focus();
      }
    }
  }
}
</script>
```

global로 사용 

**main.js**
```
app.directive('focus', {
  mounted(el) {
    el.focus();
  },
});
```

## Plugins

다국어 처리 | i18n (internationnalization) plugin

**i18n.js**
```
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i];
      }, options);
    };
  },
};
```

**main.js에 등록**
```
import i18nPlugin from './plugins/i18n';

const i18nStrings = {
  en: {
    hi: 'Hello',
  },
  ko: {
    hi: '안녕하세요',
  },
};

app.use(i18nPlugin, i18nStrings);
```

**사용**
```
<template>
  <div>
    <!-- ko.hi, en.hi가 key로 들어간다. -->
    <p>{{ $translate('ko.hi') }}</p>
    <p>{{ $translate('en.hi') }}</p>
  </div>
</template>
<script>
export default {

}
</script>
```
