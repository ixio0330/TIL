# 검색

자동완성 기능이 있는 검색창을 만들어봤다.

🚀 사용 라이브러리 : React, styled-components, react-icon

원래는 서버에 요청을 해야하는데, 서버 개발 없이 진행을 해야해서 json 파일로 데이터를 저장해두고 사용했다.

## Backend

서버는 findMatchWords 함수를 통해 사용자가 입력한 단어와 일치하는 단어들을 word.json에서 찾아서 반환해준다.

만약 입력한 단어가 빈 문자열이면 reject를 시키고, 아니라면 resolve를 시키는 간단한 구조이다.

async, await을 사용해서 실제 서버와 통신하는 느낌을 주기위해 이렇게 했다.

word.json 파일에는 단어와 빈도수가 있고, 단어에 맞게 빈도수가 높은 순서대로 보여줄 예정이다.

## Frontend

서버에 요청을 할 때, 모든 단어마다 요청을 하는게 비효율적이여서 debounce를 사용했다.

[Debounce와 Throttle](https://github.com/ixio0330/TIL/blob/main/JavaScript/Debounce.Throttle.md)에 debounce 설명을 기록해놨다.

간단히 표현하면 debounce는 발생한 동일 이벤트를 모두 처리하지 않고, 마지막 이벤트의 콜백 함수만 처리하는 함수이다.

이렇게 하면 서버에 요청을 줄일 수 있다는 장점이 있다.

최상단에 SearchComponent 컴포넌트에서 useState를 선언해서 SearchInput 컴포넌트에는 setState 함수를, SearchList 컴포넌트에는 state 값을 전달해서 각자의 역할을 하도록 했다.

SearchInput 컴포넌트를 보면 onChangeWithDebounce, onChangeWithoutDebounce 두개의 함수가 있는데 debounce를 사용한 것과 사용하지 않은 결과를 확인하기 위해 findMatchWords 함수가 호출될 때마다 count 로그를 찍도록 해봤다.

확실히 debounce를 사용하니 함수 호출량이 현저히 낮다.
