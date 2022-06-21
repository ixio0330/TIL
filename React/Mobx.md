# Mobx

Mobx는 심플하고 확장성이 뛰어난 상태 관리 라이브러리다.

Redux와는 다르게 여러 개의 store를 생성할 수 있으며, 사용법이 간단한다.

## Store

Mobx는 store 생성 방식이 총 세 가지이다. 크게 나누면 class 방식과 object 방식이 있으며, class 방식은 observable, action 수동 등록 방식과 자동 등록 방식으로 나뉜다.

### Class (makeObservable)

MakeObservable 함수를 사용해서 store를 만들면, observable과 action을 수동으로 등록해줘야 한다.

```
import { action, observable, makeObservable } from 'mobx';

class Store {
  // observable
  _message = '';

  // action
  _setMessage(message) {
    this._message = message;
  };

  constructor() {
		// 인자로 this와 observable, action이 담긴 객체를 넘겨준다.
    makeObservable(this, {
      // observable 등록
      _message: observable,

      // action 등록
      _setMessage: action,
    });
  };
}

// class 방식의 경우 instance를 생성해서 사용해야 한다.
const store = new Store();
```

### Class (makeAutoObservable)

MakeAutoObservable를 사용해서 store를 만들면 자동으로 observable과 action을 등록해준다.

```
import { makeAutoObservable } from 'mobx';

class Store {
  // observable
  _message = '';

  // action
  _setMessage(message) {
    this._message = message;
  };

  constructor() {
    makeAutoObservable(this);
  };
}

// class 방식의 경우 instance를 생성해서 사용해야 한다.
const store = new Store();
```

### Object

observable함수에 객체를 전달하면 자동으로 observable, action이 등록된다.

```
import { observable } from 'mobx';

const store = observable({
  // observable
  _message: '',

  // action
  _setMessage(message) {
    this._message = message;
  },
});
```

## 사용 방법

여러 개의 store가 존재하기 때문에 store들을 객체로 반환해주는 indexStore 함수를 만들어서 사용한다. (선택 사항)

```
const indexStore = () => ({
  store, // 다른 store들...
});

export default indexStore;
```

Mobx로 state 변동시 re-render 하려면 Component를 observer로 감싸야한다.

```
import React from 'react';
import { observer } from 'mobx-react';
import indexStore from './store';

const Component = () => {
	// indexStore 함수에서 객체로 반환받는다.
  const { store } = indexStore();

  return(
    <div>
      <p>{store._message}</p>
      <button onClick={()=>store._setMessage('Change!')}>change</button>
    </div>
  )
};

export default observer(Component);
```
