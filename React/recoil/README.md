# Recoil

Recoil은 React를 만든 React Team이 만든 상태관리 라이브러리이다.

Redux에 비해 가볍고 사용하기 편리하다는 장점이 있다고 해서 사용해봤다.

## Recoil 설치

아래 명령어로 Recoil을 설치한다.

```
$ npm i recoil
```

## Recoil 사용하기

Recoil 공식문서에는 atom, selector를 사용해서 간단한 글자 수 세어주기 앱 만드는 방법을 알려준다.

만들어야 하는 컴포넌트는 3개다.

- 사용자에게 값을 입력받을 TextInput 컴포넌트
- 사용자가 입력한 값의 길이를 나타낼 TextLength 컴포넌트
- TextInput, TextLength를 함께 렌더링 시킬 TextApp 컴포넌트

atom은 상태를 저장하는 단위이고, selector는 atom의 값을 필터링해서 얻고 싶을 때 사용한다. 

만들어볼 앱에서 사용자에게 문자열을 입력받는 input의 value를 state로 관리하려고 한다.

state.js
```
import { atom } from 'recoil';

export const textState = atom({
  key: 'textState',
  default: ''
});
```

이렇게 atom에 객체를 넣어서 만들면 전역으로 관리할 수 있는 state가 만들어진 것이다.

그리고 컴포넌트에서 사용하고 싶을 때는, useRecoilState을 사용하면 된다.

useRecoilState는 useState와 거의 유사하다.

TextInput.jsx
```
import { useRecoilState } from 'recoil';
import { textState} from './state'

export default function TextInput() {
  const [text, setText] = useRecoilState(textState);
  function onChange({ target: { value } }) {
    setText(value);
  }
  return (
    <div>
      <input type='text' value={text} onChange={onChange} />
      <br />
      Echo: { text }
    </div>
  )
}
```

이제 TextLength 컴포넌트에서 사용할 text의 length 값을 selector로 만들어보자.

state.js
```
import { selector } from 'recoil';

export const charCountState = selector({
  key: 'charCountState',
  get: ({ get }) => {
    const text = get(textState);
    return text.length;
  }
});
```

selector의 값은 읽기 전용이기 때문에 useRecoilValue hook을 사용해서 꺼내온다.

TextLength.jsx
```
import { useRecoilValue } from 'recoil';
import { charCountState } from './state';

export default function TextLength() {
  const count = useRecoilValue(charCountState);
  return <>Length: { count }</>
}
```

마지막으로 두 컴포넌트를 감쌀 TextApp 컴포넌트다.

TextApp.jsx
```
import TextInput from './TextInput';
import TextLength from './TextLength';

export default function TextApp() {
  return (
    <>
      <TextInput />
      <TextLength />
    </>
  )
}
```
