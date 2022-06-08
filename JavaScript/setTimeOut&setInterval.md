# setTimeout

setTimeout은 일정 시간 이후 callback 함수를 실행해주는 함수다.
인자로 callback함수와 시간을 넣어주면 된다.

```
setTimeout(() => {
  console.log('setTimeout');
}, 1000);
```

위 코드는 1초 후 console에 'setTimeout'이 출력된다.

# setInterfval

setInterval은 일정 시간 동안 callback 함수를 실행해주는 함수다.
인자로 callback함수와 시간을 넣어주면 된다.

```
setInterval(() => {
  console.log('setInterval');
}, 1000);
```

위 코드는 1초 마다 console에 'setInterval'이 출력된다.

# timeId

setTimeout, setInterval은 timeId를 반환한다.
clearTimeout과 clearInterval에 timeId를 인자로 넣어주면, setTimeout, setInterval을 실행을 멈춘다.

```
let count = 0;
const timeId = setInterval(() => {
  if (count > 0) {
    clearInterval(timeId);
  }
  console.log('setInterval');
  count++;
}, 1000);
```

위 코드는 console에 'setInterval'을 2번 출력한다.
자세히 보면, setInterval을 출력하고, count++해서 1을 더했다.
그러면 count는 1이 되고, if (count > 0) 이 참이므로 setInterval을 중단시켜야 한다.

setTimeout, setInterval은 외부에서 멈추는게 아니라면 무조건 최초 1회는 실행된다.

추가로 setTimeout, setInterval의 세 번째 파라미터는 callback 함수가 받을 파라미터를 넣을 수 있다.

```
const timeId = setInterval((name) => {
  if (true) clearInterval(timeId);
  console.log(`Hello ${name}`)
}, 1000, 'JavavScript');
```
