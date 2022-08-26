# 김해 음식점 정보

[김해 공공데이터개방](https://www.gimhae.go.kr/00761/00832/05867.web)에서 제공하는 [서비스 URL](https://www.gimhae.go.kr/openapi/tour/restaurant.do)을 사용해서 김해시 음식점 정보를 제공해주는 웹 어플리케이션을 개발할 예정이다.

따로 서버 없이 localStorage를 사용할 것이다.

🚀 사용 라이브러리 : React, styled-components, react-icon

## 개발 사항

- fetch api를 사용해서 김해시 음식점 목록 가져오기
- 무한 스크롤 구현
- 음식정 정보 저장, 수정, 삭제
- 음식점 정보는 폴더 별로 저장 가능하며, 폴더 삭제 시 저장되어있던 내용 전체 삭제
- 저장한 음식점 검색 (전체, 폴더)