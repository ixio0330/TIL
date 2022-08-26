import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';
import getMatchWords from '../api/index';
import debounce from '../utils/debounce';

const SearchInputTeamplte = styled.div`
  width: 300px;
  position: relative;
`

const SearchInputText = styled.input`
  all: unset;
  width: 300px;
  padding: 10px 30px 10px 10px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid #ddd;
  transition: 0.2s;
  &:focus {
    border-color: #999;
  }
`

const SearchInputIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  padding: 10px;
`

export default function SearchInput({ setWordList }) {
  const onChangeWithDebounce = debounce(async ({ target }) => {
    try {
      const words = await getMatchWords(target.value);
      setWordList(words);
    } catch (error) {
      setWordList([]);
    }
  }, 300);

  const onChangeWithoutDebounce = async ({ target }) => {
    try {
      const words = await getMatchWords(target.value);
      setWordList(words);
    } catch (error) {
      setWordList([]);
    }
  }

  return (
    <SearchInputTeamplte>
      <SearchInputText onChange={onChangeWithDebounce} type="text" />
      <SearchInputIcon>
        <AiOutlineSearch />
      </SearchInputIcon>
    </SearchInputTeamplte>
  )
}