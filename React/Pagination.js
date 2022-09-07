import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PostItem from "./PostItem";

const PostListTemplate = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PaginationButtonContainer = styled.div`
  text-align: center;
`;

const PaginationControlButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 5px;
`;

const PaginationIndexButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 5px;
  margin: 0 5px;
`;

export default function PostList({ posts }) {
  const max = 10;
  const [buttonList, setButtonList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  
  useEffect(() => {
    const tempButtonList = [];
    for (let i = 0; i < Math.ceil(posts.length / max); i++) {
      tempButtonList.push({
        isShow: i < 5,
        index: i + 1,
        start: i * max,
        end: (i * max) + max,
      })
    }
    setButtonList((prevState) => prevState = tempButtonList);
  }, []);

  useEffect(() => {
    if (currentIndex === 1 || currentIndex === 2 || currentIndex === 3) {
      // 1~5페이지 보여주기
      setButtonList((prevState) => {
        prevState.forEach((button) => {
          button.isShow = button.index <= 5;
          return button;
        });
        return prevState;
      })
      return;
    }

    if (currentIndex === buttonList.length || currentIndex === buttonList.length - 1 || currentIndex === buttonList.length - 2) {
      // 마지막~마지막-5
      setButtonList((prevState) => {
        prevState.forEach((button) => {
          button.isShow = button.index > buttonList.length - 5;
          return button;
        });
        return prevState;
      })
      return;
    }

    // 가운데를 기준으로 양옆에 두개씩 보여주기
    setButtonList((prevState) => {
      prevState.forEach((button) => {
        button.isShow = currentIndex - 2 <= button.index && currentIndex + 2 >= button.index;
        return button;
      });
      return prevState;
    });
  }, [currentIndex, buttonList.length]);

  function onClickPrev() {
    if (start <= 0) {
      console.log('처음 페이지 입니다.');
      return;
    }
    setCurrentIndex((prev) => prev -= 1);
    setStart((prev) => prev -= max);
    setEnd((prev) => prev -= max);
  }

  function onClickNext() {
    if (posts.length <= end) {
      console.log('마지막 페이지 입니다.');
      return;
    }
    setCurrentIndex((prev) => prev += 1);
    setStart((prev) => prev += max);
    setEnd((prev) => prev += max);
  }

  function onClickIndex(button) {
    setCurrentIndex((prev) => prev = button.index);
    setStart((prev) => prev = button.start);
    setEnd((prev) => prev = button.end);
  }

  const postList = posts.slice(start, end);
  return (
    <>
      <PostListTemplate>
      {
        postList.map((post) => <PostItem key={post.id} {...post} />)
      }
    </PostListTemplate>
    <PaginationButtonContainer>
      <PaginationControlButton onClick={onClickPrev}>{ '<' }</PaginationControlButton>
      {
        buttonList
          .filter((button) => button.isShow)
          .map((button) => 
            <PaginationIndexButton 
              style={{ border: currentIndex === button.index ? '1px solid #ddd' : '1px solid #fff'}} 
              onClick={() => onClickIndex(button)} key={`pagination_btn${button.index}`}
            > 
              {button.index}
            </PaginationIndexButton>
          )
      }
      <PaginationControlButton onClick={onClickNext}>{ '>' }</PaginationControlButton>
    </PaginationButtonContainer>
    </>
  )
}
