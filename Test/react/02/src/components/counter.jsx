import { useCallback } from "react";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const onIncrease = useCallback(() => {
    setCount(count + 1);
  }, [count]);
  const onDecrease = useCallback(() => {
    setCount(count - 1);
  }, [count]);
  return (
    <div>
      <p>{count}</p>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </div>
  )
}