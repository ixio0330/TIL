import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

const textState = atom({
  key: 'textState',
  default: ''
});

const charCountState = selector({
  key: 'charCountState',
  get: ({ get }) => {
    const text = get(textState);
    return text.length;
  }
});

function TextInput() {
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

function TextLength() {
  const count = useRecoilValue(charCountState);
  return <>Length: { count }</>
}

export default function TextApp() {
  return (
    <>
      <TextInput />
      <TextLength />
    </>
  )
}

