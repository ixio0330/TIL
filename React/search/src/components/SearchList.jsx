import styled from "styled-components"

const SearchListTemplate = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const SearchListItem = styled.li`
  max-width: 300px;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
`

export default function SearchList({ wordList }) {
  return (
    <SearchListTemplate>
      {
        wordList.map((word, index) => <SearchListItem key={index}>{word.word}</SearchListItem>)
      }
    </SearchListTemplate>
  )
}