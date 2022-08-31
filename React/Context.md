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

## Context 활용

Context를 사용해서 간단한 TODO App을 만들었다.

스타일은 크게 건들지 않았지만, styled-component와 react-icons를 함께 사용했다.

TodoView.jsx
```
import { createContext } from 'react';
import TodoInput from "./todo/TodoInput";
import TodoList from "./todo/TodoList";
import { useReducer } from 'react';
import * as uuid from 'uuid';

function reducer(state, action) {
  switch (action.type) {
    case 'create':
      state = [...state, {
        id: uuid.v1(),
        text: action.todo.text,
      }]; 
      return state;
    case 'update':
      const find = state.find((todo) => todo.id === action.todo.id);
      if (!find) {
        throw new Error(`Unknowned todo id: ${action.todo.id}`);
      }
      find.text = action.todo.text;
      return state;
    case 'delete':
      state = state.filter((todo) => todo.id !== action.todo.id);
      return state;
    default:
      throw new Error(`Unknowned action type: ${action.type}`)
  }
}

export const TodoContext = createContext(null);

export default function TodoView() {
  const [todos, dispatch] = useReducer(reducer, []);
  const value = {
    todos,
    dispatch
  };

  return (
    <TodoContext.Provider value={value}>
      <TodoInput />
      <TodoList />
    </TodoContext.Provider>
  )
}
```

TodoInput.jsx
```
import { useRef } from 'react';
import { useContext } from 'react';
import { TodoContext } from '../TodoView';
import { AiOutlinePlus } from 'react-icons/ai';

export default function TodoInput() {
  const { dispatch } = useContext(TodoContext);
  const inputRef = useRef(null);
  const onChange = (e) => {
    if (!e.target.value) return;
    inputRef.current = e.target.value;
  };
  const onClick = () => {
    dispatch(
      { 
        type: 'create', 
        todo: {
          text: inputRef.current
        }
      }
    );
  };
  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      onClick();
    }
  };

  return (
    <div>
      <input type="text" ref={inputRef} onChange={onChange} onKeyUp={onKeyUp} />
      <button onClick={onClick}><AiOutlinePlus /></button>
    </div>
  )
}
```

TodoList.jsx
```
import { useContext } from 'react';
import { TodoContext } from '../TodoView';
import TodoItem from './TodoItem';
import styled from 'styled-components';
const TodoListTemplate = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export default function TodoList() {
  const { todos, dispatch } = useContext(TodoContext);

  const onDelete = (todo) => {
    dispatch({ type: 'delete', todo });
  };

  const onUpdate = (todo) => {
    dispatch({ type: 'update', todo });
  };

  return (
    <TodoListTemplate>
      {
        todos.map(todo => 
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onDelete={onDelete} 
            onUpdate={onUpdate} 
          />)
      }
    </TodoListTemplate>
  );
}
```

TodoItem.jsx
```
import { useRef } from "react";
import styled from "styled-components";
import { AiOutlineDelete, AiOutlineUpload } from 'react-icons/ai';
const TodoItemTemplate = styled.li`
  border: 1px solid #ddd;
  padding: 10px 15px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`;
const TodoItemInput = styled.input`
  all: unset;
  width: 100%;
  margin-right: 10px;
`;

export default function TodoItem({ todo, onDelete, onUpdate }) {
  const inputRef = useRef(todo.text);
  const onChange = (e) => {
    inputRef.current = e.target.value;
  };

  const requestUpdate = (id) => {
    if (!inputRef.current) return;
    onUpdate({
      id,
      text: inputRef.current.value ?? inputRef.current,
    });
  };

  return (
    <TodoItemTemplate>
      <TodoItemInput defaultValue={todo.text} onBlur={() => requestUpdate(todo.id)} onChange={onChange} ref={inputRef} />
      <button onClick={() => requestUpdate(todo.id)}><AiOutlineUpload /></button>
      <button onClick={() => onDelete(todo)}><AiOutlineDelete /></button>
    </TodoItemTemplate>
  );
}
```

#### 참고자료

[Context](https://ko.reactjs.org/docs/context.html)
