import { useSetRecoilState } from "recoil"
import { todoListFilterTypeState } from "./state"

export default function TodoFilters() {
  const setType = useSetRecoilState(todoListFilterTypeState);
  function updateType({ target: { name } }) {
    setType(name);
  }
  return (
    <div>
      <button onClick={updateType} name='all'>All</button>
      <button onClick={updateType} name='completed'>Completed</button>
      <button onClick={updateType} name='uncompleted'>Uncompleted</button>
    </div>
  ) 
}