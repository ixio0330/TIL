import React, { useState, useEffect, useMemo, useTransition } from 'react';
import './style.css';

export default function App() {
  const [start, setStart] = useState(1);
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition({ timeoutMs: 3000 });
  const startToNumber = useMemo(() => parseInt(start || 0), [start]);
  const onChangeStart = (e) => {
    if (e.target.value < 0) return;
    setStart(e.target.value);
  };
  useEffect(() => {
    if (start === '') return;
    startTransition(() => {
      setList([...new Array(10000).keys()].map((i) => i + startToNumber));
    });
  }, [start]);
  return (
    <div>
      <div>
        <input type="number" value={start} onChange={onChangeStart} />
        <span> ___ </span>
        <span>
          Start From {start} To {startToNumber * 10000}
        </span>
      </div>
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {list.map((item) => (
            <p style={{ minWidth: 50, maxWidth: 300 }} key={item}>
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
