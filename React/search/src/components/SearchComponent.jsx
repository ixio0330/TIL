import { useState } from "react";
import SearchInput from "./SearchInput";
import SearchList from "./SearchList";

export default function SearchComponent() {
  const [wordList, setWordList] = useState([]);

  return (
    <>
      <SearchInput setWordList={setWordList} />
      <SearchList wordList={wordList} />
    </>
  )
}