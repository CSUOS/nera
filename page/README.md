# Page 폴더 관련사항 정리

## React 구동법

page 폴더가 현재 작업 디렉토리인 채로 `npm start`나 `yarn start` 명령 실행



## 흐름 정리

1. index.js => index.html

   public의 index.html 내에 있는 id가 root인 div에 index.js의 render가 작용함

2. Root.js => index.js

   src의 client 디렉토리에 있는 Root.js가 index.js에서 컴포넌트로 호출됨

3. App.js => Root.js

   Root.js는 src의 shared 디렉토리에 있는 App.js를 컴포넌트로 호출

4. Login, Main.js => App.js

   App.js는 각 페이지로 가는 라우트를 설정하는 컴포넌트

   주소에 따라 각각의 컴포넌트 호출

5. Header, SideBar, Home, Assignment, Error, Setting.js, SubmissionStatus.js, Scoring.js => Main.js

   Main.js는 Header와 SideBar 그리고 메인 컨텐츠 영역으로 구성되어있음
   
   => 메인 컨텐츠 영역은 url에 따라 pages의 컴포넌트들로 바뀜
   
6. components의 js => pages의 js

   각 컴포넌트들은 페이지들에서 쓰이며, 쓰이는 대로 호출됨



## 폴더 정리

* public

  정적인 파일들을 담아두는 디렉토리

  * style.css

* src

  * client

    index.js로 랜더링되는 최종 js만을 담아두는 디렉토리

  * components

    여러 페이지에서 공통적으로 쓰이는 컴포넌트 요소들을 담아두는 디렉토리

  * pages

    구현된 페이지들을 담아두는 디렉토리

  * shared

    라우트를 담당하는 App.js를 담아두는 디렉토리

  

css 파일들은 page 별로 따로, components는 하나의 파일로 관리

> page의 공통된 css는 *pages.css* 에서 관리

material 라이브러리의 커스터마이징은 *material.css*에서 관리



## 페이지 정리

| url                                                          | 페이지 유형 | 비고           |
| ------------------------------------------------------------ | ----------- | -------------- |
| http://localhost:3000/                                       | 로그인      | 버튼 클릭 시 home 페이지로 이동 |
| http://localhost:3000/home                                   | 메인 페이지 |                |
| http://localhost:3000/home/assignment/:as_id | 과제 페이지 | type에 따라 컴포넌트가 랜더링 됨<br>학생 : Assignment.js<br>교수: SubmissionStatus.js |
| http://localhost:3000/home/setting/:as_id | 과제 관리 페이지 | 교수님만 접근 가능 |
| http://localhost:3000/home/scoring/:as_id/:user_number | 답안 채점 페이지 | 교수님만 접근 가능<br>각 문제에 대한 답안을<br>한 페이지씩 보여줌 |
|                                              |                  |                |



## 데이터 정리

https://www.notion.so/data-049c77d3a2614f8fa3dde8cd5b580ee4

 모든 데이터는 Main.js에서 관리하며 렌더링할 컴포넌트가 필요로 하는 정보를 넘겨주는 식으로 진행함



## 라이브러리

Material-UI 사용


