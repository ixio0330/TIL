# Promise

Promise는 비동기 처리를 할 때 사용한다.

## Promise의 상태 값

Promise는 상태 값을 가진다.

- pending (대기)
- fulfilled (실행)
- reject (거부)

## Promise 설명

Promise는 new로 인스턴스를 생성하는데, 이 때 실행 함수를 넘겨준다.

실행 함수는 promise 인스턴스가 생성 될 때 실행된다.

```
const executor = (resolve, reject) => {
  console.log('일단 실행된다.');
  resolve('Success!');
};

const promise = new Promise(executor);
```

코드를 실행시키면 console창에 '일단 실행된다.'가 출력된다.

## Promise 사용

Promise의 resolve된 결과 값을 사용하기 위해서는 .then() 함수를 사용하고 reject된 결과 값을 사용하기 위해서는 .catch() 함수를 사용한다.

```
promise
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
```

코드를 실행시키면 console 창에 'Success!'가 출력된다.

```
promise
  .then(console.log)
  .catch(console.log);
```

이렇게 사용하는 경우도 있는데, 이건 then이나 catch에 callback으로 넘겨준 console.log라는 함수가 executor 함수에서 실행되기 때문이다.

```
// 이렇게 사용하면
const promise = new Promise(executor);
promise
  .then(console.log)
  .catch(console.log);

// 여기서 받은 resolve함수가 console.log이기 때문에
function executor(console.log, reject) {
  console.log('일단 실행된다.');
  // 이렇게 실행된다.
  console.log('Success!');
};
```

## Promise로 랜덤 숫자에 따른 resolve, reject 결과 출력하기

```
const _executor = ((resolve, reject) => {
  console.log('[INFO] Insice executor..');
  let result;

  let random = Math.floor(Math.random() * 50);
  setTimeout(()=>{
    if (random >= 25) {
      result = {
        OK: true,
        message: 'Success!',
        data: [random]
      };
			// random이 25 이상이면 resolve(fulfilled) 한다.
      resolve(result);
    } else {
      result = {
        OK: false,
        message: 'Fail..',
        data: null
      };
			// random이 25 미만이면 reject(거부) 한다.
      reject(result);
    }
  }, 2000);
});

const promise = new Promise(_executor);

promise()
	.then(response => console.log(response))
	.catch(error => console.log(error))
	.finally(()=> console.log('End'));
```

finally는 promise가 모두 끝난 뒤에 처리해야 할 경우 사용한다.
