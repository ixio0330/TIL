import { useCallback } from "react";
import { useState } from "react";

export default function DelayedToggle() {
  const [toggle, setToggle] = useState(false);
  const onToggle = useCallback(() => {
    setTimeout(() => {
      setToggle((toggle) => !toggle);
    }, 500);
  }, []);
  return (
    <div>
      <button onClick={onToggle}>Toggle</button>
      <p>Status:</p>
      <span>{toggle ? 'ON' : 'OFF'}</span>
    </div>
  )
}