# React

React에서 사용되는 모듈이나 관련된 지식을 정리합니다.

이 페이지에서는 React에 대한 간단한 소개를 합니다.

## React란 무엇인가?

React는 Virtual DOM을 활용해 실제 DOM에 접근하여 조작하는 대신 이를 추상화한 자바스크립트 객체를 구성하여 사용한다. 

즉 동적으로 데이터가 변화했을 때 직접적으로 DOM을 조작하는 것이 아니라 DOM의 사본이라고 할 수 있는 새로운 Virtual DOM을 생성한다. 

그리고 새로 생성된 Virtual DOM과 이전에 저장된 Virtual DOM을 비교해 변경된 부분의 DOM 만을 변경한다. 이 과정을 조화 과정(reconciliation) 이라고 한다.

**React에서 가상돔을 사용하는 이유**는 실제 DOM을 조작하기엔 DOM을 그리는 과정이 복잡하기 때문이다.

## React의 jsx문법

JSX는 자바스크립트의 확장 문법이고, react의 요소를 만들어준다.

```
function myJSX() {
  return (
    <div>
      <p>Hello JSX!</p>
    </div>
  )
}
```

myJSX 함수는 JSX 문법으로 component를 생성하는 방식이다.

```
function makeJSX() {
  return (
		React.createElement('div', null, React.createElement('p', null, 'Hello JSX!'))
	)
}
```

두 함수는 같은 결과를 만드는데, myJSX는 makeJSX로 변환되어 react의 요소를 만든다.

## Component

Component는 react에서 가장 중요한 개념이다. 웹 UI에서는 페이지마다 공통적으로 사용되는 요소들이 있는데 이런 요소를 component로 만들어 놓고, 필요하면 import 해와서 사용하기만 하면 된다.

**Component 규칙**

- 이름 첫 글자는 무조건 대문자
- render 함수에 jsx 문법으로 html 태그 작성
- props는 단방향. 부모 → 자식 방향으로만 전달 가능

React는 component를 생성하는 방식이 두 가지이다. class와 함수 방식인데, 함수 컴포넌트가 최근 문법이다.

### Class Component
```
class ComponentClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'temp'
    };
  }

  setName(name) {
    this.state.name = name;
  }

  render() {
    return (
      <div></div>
    )
  }
};
```

### Function Component
```
function FunctionComponent() {
  const [state, setState] = useState('temp');
  const onChangeState = (e) => setState(e.target.value);
  
  return(
    <div>
    </div>
  )
}
```

## State

State는 component가 가지는 상태 값을 의미한다. state는 UI에서 보여줘야 하는 데이터를 담거나, 서버에 보내야하는 데이터를 담을 때 주로 사용한다.

**Function component state사용하기**

useState를 사용해 구조 분해 할당으로 state와 setState를 받는다.

state에는 초기에 담은 'something'이라는 데이터가 있고, setState는 state를 변경할 수 있는 함수이다.

```
import { useState } from 'react';

function Component() {
  const [state, setState] = useState('something');
}
```

만약 state를 something이 아니라 other로 바꾸고 싶다면, state를 직접적으로 변경하는게 아니라 setState를 사용한다.

```
state = 'other' // X
setState('other'); // O
```

위에 선언한 const [state, setState] 는 원하는대로 이름을 설정해 줄 수 있다.

```
const [인사, 인사바꾸기] = useState('안녕하세요');
인사바꾸기('Hello');
```

이런 식으로도 사용이 가능하다.

아래 코드는 state를 사용해서 간단한 counter를 구현한 component이다.

```
import { useState } from 'react';

function Counter () {
  const [num, setNum] = useState(0);

  return (
    <div>
      <p>Num: {num}</p>
      <button onClick={()=>setNum(num + 1)}>+</button>
      <button onClick={()=>setNum(num - 1)}>-</button>
    </div>
  )
}
```

## Props

Props는 property의 약자로 부모 component로부터 받은 데이터를 의미한다. 

Component를 만들어서 사용하다 보면, component간에 데이터들을 주고 받아야 할 때가 있다. 그럴 때 사용하는게 props이다.

부모 -> 자식 방향인 단방향으로만 보낼 수 있으며, 자식 -> 부모 혹은 자식 -> 자식 간에는 props를 보낼 수 없다.

Props는 객체이기 때문에 구조 분해 할당 문법으로 사용 가능하다.

아래 Counter component는 num이 보여지는 View와 num을 증가시키고 감소시키는 Button Component로 분리되어 있다.

```
function View(props) {
  return (
    <div>
      <p>{props.num}</p>
    </div>
  );
}

function Button({setNum}) {
  return (
    <div>
      <button onClick={()=>setNum(num + 1)}>+</button>
      <button onClick={()=>setNum(num - 1)}>-</button>
    </div>
  );
}

function Counter() {
  const [num, setNum] = useState(0);

  return (
    <>
      {/* num = prop이름, {num} = prop으로 넘겨질 data */}
      <View num={num} />
      {/* setNum = prop이름, {setNum} = prop으로 넘겨질 data */}
      <Button setNum={setNum} />
    </>
  );
}
```

Button과 View component는 num이라는 state가 없고 Counter라는 최상위 component만 num과 num을 설정하는 setNum을 갖고 있기 때문에, props로 넘겨준 것이다.

## Re-render

React는 다음과 같은 경우에 **re-render**된다.

1. Props 변경되었을 때
2. State 변경되었을 때
3. forceUpdate() 실행하였을 때
4. 부모 component가 렌더링 되었을 때

## Life Cycle

React component의 가장 대표적인 생명주기는 세 가지이다.

- componentDidMount: component가 **마운트** 된 후 **최초 한번**만 실행
- componentDidUpdate: component가 **갱신**된 후 실행 (state, props등의 변경이 있을 때)
- componentWillUnmount: component가 **제거되기 직전**에 실행

### Class

```
class ComponentClass extends React.Component {
  componentDidMount() {
    ...code
  }

  componentDidUpdate() {
	  ...code
  }

  componentWillUnmount() {
    ...code
  }
}
```

### Function

```
function FunctionComponent () {

  // componentDidMount
  useEffect(()=> {
    ...code
  }, []);

  // componentDidUpdate
  useEffect(()=> {
    return() => {
      ...code
    }
  });

  // componentWillUnmount
  useEffect(()=> {
    return() => {
      ...code
    }
  }, []);
}
```

##### 참고자료
React 공식문서

https://ko.reactjs.org/
