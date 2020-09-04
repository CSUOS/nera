<p align="center">
      <h1 align="center">Frontend 문서</h2>
	  <p align="center">
    	<a href="https://github.com/CSUOS/nera/issues">Report Bug</a>
  	  </p>
</p>

[v1.0.0]

# 목차

- [페이지 실행](#페이지-실행)
- [디렉토리 구조](#디렉토리-구조)
- [라우팅 구조](#라우팅-구조)

## 페이지 실행

page 디렉토리에서 다음의 명령어로 실행

```
yarn start (또는 npm start)
```

## 디렉토리 구조

- public

  - css
    - [material.css](####material.css)
    - [reset.js](####reset.js)

- src

  - client

    - [Root.js](####Root.js)

  - components

    - [index.js](####index.js)
    - [AssignmentBox.js](####Assignment.js)
    - [BottomPopup.js](BottomPopup.js)
    - [Header.js](####Header.js)
    - [Loading.js](####Loading.js)
    - [MarkdownEditor.js](####MarkdownEditor.js)
    - [MarkdownViewer.js](####MarkdownViewer.js)
    - [PageInfo.js](####PageInfo.js)
    - [Problem.js](####Problem.js)
    - [QuestionSelector.js](####QuestionSelector.js)
    - [ScoreStats.js](####ScoreStats.js)
    - [SideBar.js](####SideBar.js)
    - [StudentSelector.js](####StudentSelector.js)
    - [TimePicker.js](####TimePicker.js)
    - [UserAnswer.js](####UserAnswer.js)
    - [UseRequest.js](####UseRequest.js)
    - [components.css](####components.css)

  - pages

    - [index.js](####index.js)
    - [Assignment.js](####Assignment.js)
    - [Error.js](####Error.js)
    - [Home.js](####Home.js)
    - [Login.js](####Login.js)
    - [Main.js](####Main.js)
    - [Scoring.js](####Scoring.js)
    - [SetAssignment.js](####SetAssignment.js)
    - [SetStudentList.js](####SetStudentList.js)
    - [Setting.js](####Setting.js)
    - [pages.css](####pages.css)

  - shared

    - [App.js](####App.js)
    - [DateToString.js](####DateToString.js)
    - [GetUserInfo.js](####GetUserInfo.js)
    - [MajorDictionary.js](####MajorDictionary.js)

---

### 디렉토리 정보

- public

  정적인 파일들을 담아두는 디렉토리

  - style.css

- src

  - client

    index.js로 랜더링되는 최종 js만을 담아두는 디렉토리

  - components

    여러 페이지에서 공통적으로 쓰이는 컴포넌트 요소들을 담아두는 디렉토리

  - pages

    구현된 페이지들을 담아두는 디렉토리

  - shared

    라우트를 담당하는 App.js를 담아두는 디렉토리

### 파일 정보

#### material.css

라이브러리 *material UI*에 대한 수정사항을 담은 css 파일이다.

#### reset.css

(imported at index.html)

프로젝트 전체 css의 초기화를 담당하는 파일이다.

#### Root.js

BrowserRouter를 적용하고 실질적인 루트 컴포넌트 App을 호출하는 역할을 하는 파일이다.

#### index.js

pages 폴더와 components 폴더에 하나씩 있다.

해당 폴더의 js 파일을 한 데에 모아서 export하기 위해 사용된다. 해당 폴더 이외의 폴더에서 컴포넌트를 사용하기 위해서는 index.js 파일을 통해 모든 컴포넌트에 접근할 수 있다.

#### AssignmentBox.js

과제로 이동하는 과제 태그 리스트를 표현하기 위한 컴포넌트이다.

#### BottomPopup.js

이벤트를 표시하기 위한 컴포넌트이지만, 아직 사용되지 않았다.

#### Header.js

위측 상단 바를 표시하기 위한 컴포넌트이다.

#### Loading.js

api 연동 및 웹페이지 렌더링 시 대기 상태를 표시하기 위한 컴포넌트이다.

#### MarkdownEditor.js

마크다운 및 LaTeX(KaTeX) 형식으로 텍스트를 작성하고 그 렌더링 결과를 실시간으로 확인할 수 있는 편집기 컴포넌트이다. 내부적으로 텍스트 에디터로는 AceEditor, 마크다운을 렌더링하는데는 MarkdownViewer를 사용한다.

#### MarkdownViewer.js

마크다운 및 LaTeX(KaTeX) 형식의 텍스트가 소스로 주어졌을 때, 이를 렌더링하여 HTML 문서 형식으로 띄워주는 뷰어 컴포넌트이다.

#### PageInfo.js

각 페이지에서 해당 페이지를 설명하는 아이콘, 제목, 부제목을 표시하기 위한 컴포넌트이다.

#### Problem.js

학생이 과제 답안을 작성하는 페이지(Assignment.js)에서 각 문제를 띄우는데 사용되는 컴포넌트이다. 문제의 지문을 MarkdownViewer로 렌더링하여 표시하고, 학생이 답안을 MarkdownEditor로 작성할 수 있게 한다.

#### QuestionSelector.js

Scoring.js에서 사용되는 컴포넌트로 특정 과제의 문제 목록을 표 형식으로 보여주고, 여러 행을 사용자가 선택할 수 있다.

#### ScoreStats.js

Scoring.js에서 사용되는 컴포넌트로 특정 과제의 각 학생의 체출 현황, 채점 완료 여부, 각 문제의 점수, 점수의 총 합산 등을 확인할 수 있다.

#### SideBar.js

왼쪽 사이드 메뉴바를 표시하기 위한 컴포넌트이다.

#### StudentSelector.js

Scoring.js에서 사용되는 컴포넌트로 QuestionSelector에서 선택된 문제 정보가 주어졌을 때, 각 수강생들에 대하여 그 문제의 답안을 제출하였는지, 그 답안을 채점하였는지에 대한 정보를 확인할 수 있으며, QuestionSelector.js와 마찬가지로 여러 행을 사용자가 선택할 수 있다.

#### TimePicker.js

과제 일정을 정하기 위한 날짜 선택 달력 컴포넌트이다.

#### UserAnswer.js

사용자의 답안을 표시하기 위한 컴포넌트이다.

#### UseRequest.js

요청을 받아서 api로 요청을 보낸후, 결과와 에러를 처리하는 컴포넌트이다.

#### components.css

components 디렉토리의 컴포넌트 css를 통틀어서 관리하는 파일이다.

#### Assignment.js

학생이 과제의 답안을 작성하는 페이지이다.

#### Error.js

Error가 발생했을 때, 표시되는 페이지이다.

#### Home.js

로그인 후 가장 처음 사이트에 접근했을 때 표시되는 페이지로 사용자의 과제 정보가 간단하게 표시되어있다.

#### Login.js

처음 사이트에 접근했을 때 표시되는 페이지로 로그인 페이지이다. 로그인하게 되면 Home.js가 표시된다.

#### Main.js

사용자에게 드러나는 페이지 그 자체이다. 헤더와 사이드바, 메인 컨텐츠로 이루어져있고 메인 컨텐츠는 접근 url에 따라 각각의 페이지 컴포넌트로 전환된다.

#### Scoring.js

교수님이 학생들의 점수 통계를 확인하고, 답안을 채점할 수 있는 컴포넌트이다.

#### SetAssignment.js

과제의 세부 사항을 설정하는 페이지 컴포넌트이다.

#### SetStudentList.js

수강생 목록을 관리하는 페이지 컴포넌트이다.

#### Setting.js

사용자에 할당된 과제 목록을 띄워주는 페이지 컴포넌트이다.

#### pages.css

pages 디렉토리의 컴포넌트 css를 통틀어서 관리하는 파일이다.

#### App.js

Root.js에서 호출되는 컴포넌트로 라우팅을 담당한다. 크게 Login 컴포넌트와 Main 컴포넌트로 라우팅된다.

#### DateToString.js

Date 객체를 String 형태로 받기 위한 함수 모듈이다.

#### GetUserInfo.js

cookie의 jwt token을 이용해 사용자 정보를 가져오기 위한 함수 모듈이다.

#### MajorDictionary.js

학번에 따른 전공을 추출하기 위한 함수 모듈이다.

## 라우팅 구조

| url                                          | 페이지 유형             | 비고                                                                                               |
| -------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| https://nera.csuos.ml/                       | 로그인                  | Login.js                                                                                           |
| https://nera.csuos.ml/home                   | 메인 페이지             | Main.js => Home.js                                                                                 |
| https://nera.csuos.ml/home/assignment/:as_id | 과제 페이지             | type에 따라 컴포넌트가 랜더링 됨<br>학생 : Main.js => Assignment.js<br>교수: Main.js => Scoring.js |
| https://nera.csuos.ml/home/setting           | 과제 목록 페이지        | 교수님만 접근 가능<br/>Main.js => Setting.js                                                       |
| https://nera.csuos.ml/home/setting/:as_id    | 과제 관리 페이지        | 교수님만 접근 가능<br>Main.js => SetAssignment.js                                                  |
| https://nera.csuos.ml/home/setList           | 수강생 목록 관리 페이지 | 교수님만 접근 가능<br>Main.js => SetStudentList.js                                                 |
