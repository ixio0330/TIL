# Context

Context는 컴포넌트의 단계가 깊어져 props를 전달하기 어려울 때 사용한다.

React 공식문서에는 context를 사용하면 컴포넌트를 재사용하기가 어려워지므로 꼭 필요할 때만 쓰라고 당부하고 있다.

## Context 사용하기

Context를 createContext로 생성하고, 상태를 관리할 최상단 컴포넌트에서 Context로 컴포넌트들을 감싼다.

그리고 value에 자식 컴포넌트들이 사용할 state나 함수들을 담아서 전달해주면 된다. 나는 객체로 만들어서 전달했다.

ContextView.jsx
```
import { useState } from 'react';
import { createContext } from 'react';
import ContextContent1 from '../components/ContextContent1';
import ContextContent2 from '../components/ContextContent2';
export const ContextStore = createContext(null);

export default function ContextView() {
  const [state, setState] = useState('init state');

  const updateState = (update) => {
    setState((prevState) => prevState = update);
  };

  const value = {
    state,
    updateState,
  };

  return (
    <ContextStore.Provider value={value}>
      <ContextContent1 />
      <ContextContent2 />
    </ContextStore.Provider>
  )
}
```

함수 컴포넌트는 useContext hook으로 context의 value에 접근할 수 있다.

ContextContent1는 state 값을 보여주는 역할을 하는 컴포넌트다.

ContextContent1.jsx

```
import { ContextStore } from "../views/ContextView";
import { useContext } from "react";
export default function ContextContent1() {
  const { state } = useContext(ContextStore);
  return <p>state: { state }</p>;
}
```

ContextContent2는 state 값을 업데이트 하는 역할을 하는 컴포넌트다.

ContextContent2.jsx

```
import { ContextStore } from "../views/ContextView";
import { useContext } from "react";
import { useRef } from "react";export default function ContextContent2() {
  const inputRef = useRef(null);
  const { updateState } = useContext(ContextStore);
  const onChange = (e) => {
    if (!e.target.value) return;
    inputRef.current = e.target.value;
  };
  const onClick = () => {
    updateState(inputRef.current)
  };
  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      onClick();
    }
  };
  return (
    <div>
      <input type="text" ref={inputRef} onChange={onChange} onKeyUp={onKeyUp} />
      <button onClick={onClick}>update</button>
    </div>
  );
}
```

#### 참고자료

[Context](https://ko.reactjs.org/docs/context.html)
