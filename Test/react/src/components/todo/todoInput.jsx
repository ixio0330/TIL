import { useCallback } from "react";
import { useState } from "react";

export default function TodoInput({ onInsert }) {
  const [todo, setTodo] = useState('');
  const onChangeTodo = useCallback(({ target }) => {
    setTodo(target.value);
  }, []);
  const onInsertTodo = useCallback((e) => {
    onInsert(todo);
    setTodo('');
    e.preventDefault();
  }, [ onInsert, todo ]);
  return(
    <form>
      <input 
        type="text" 
        placeholder="할 일을 입력해주세요"
        value={todo}
        onChange={onChangeTodo}
      />
      <button onClick={onInsertTodo}>등록</button>
    </form>
  );
}