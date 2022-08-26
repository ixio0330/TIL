# Debounce와 Throttle

Debounce와 Throttle은 이벤트 처리를 효율적으로 할 수 있도록 해준다.

예를 들어, 사용자에게 검색할 문자를 입력 받아 서버와의 통신 후 연관 검색어를 보여주는 기능을 개발한다고 했을 때.

사용자가 입력한 모든 값에 대해 서버에 요청을 하게 되면, 서버에 부담이 될 수 있다.

"프론트엔드"이라는 단어를 검색을 하려는 사용자가 있다면, "ㅍ", "프", "플", "프로", "프론", ... 처럼 많은 과정을 거치는데, 상관 없는 단어까지 서버에 요청할 수 있게 된다는 것이다.

이 때, debounce를 사용해서 서버에 요청을 하는 횟수를 줄일 수 있다.

## Debounce

Debounce는 동일 이벤트가 반복적으로 발생하면, 마지막 이벤트가 실행되고나서 일정 시간동안 이벤트가 다시 실행되지 않으면 이벤트의 콜백 함수를 실행한다.

debounce.js

```
export default function debounce(callback, limit = 100) {
  let inDebounce;
  return function(...args) {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => {
      callback.apply(this, args);
    }, limit);
  }
}
```

## Throttle

Throttle은 동일 이벤트가 반복적으로 실행되는 경우 일정 시간 간격으로 콜백 함수를 실행한다.

throttle.js

```
export default function throttle(callback, limit = 100) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      callback.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  }
}
```

Debounce와 throttle을 사용해보자.

## Debounce와 Throttle 적용하기

index.html

```
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Optimization</title>
</head>
<body>
  <div class="debounce">
    <input type="text" id="input_search" >
    <p>
      debounce 적용: <span id="span_debounce">0</span>
    </p>
  </div>
  <div class="throttle">
    <p>
      throttle 적용: <span id="span_throttle">0</span>
    </p>
    <p>
      throttle 미적용: <span id="span_no_throttle">0</span>
    </p>
  </div>
  <script src="./main.js" type="module"></script>
</body>
</html>
```

main.js

```
import debounce from "./debounce.js";
import throttle from "./throttle.js";

const elSearch = document.querySelector('#input_search');
const elDebounceText = document.querySelector('#span_debounce');
const elThrottleText = document.querySelector('#span_throttle');
const elNoThrottleText = document.querySelector('#span_no_throttle');

let debounceCount = 0;
elSearch.addEventListener('input', debounce(() => {
  elDebounceText.textContent = ++debounceCount;
}, 100));

let throttleCount = 0;
window.addEventListener('mousemove', throttle(() => {
  elThrottleText.textContent = ++throttleCount;
}, 500));

let noThrottleCount = 0;
window.addEventListener('mousemove', () => {
  elNoThrottleText.textContent = ++noThrottleCount;
});
```

#### 참고자료

[자바스크립트: Debounce, Throttle 순수 자바스크립트 (Vanilla JS)로 구현](http://yoonbumtae.com/?p=3584)
