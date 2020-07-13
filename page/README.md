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

4. Login, Main, Problem.js => App.js

   App.js는 각 페이지로 가는 라우트를 설정하는 컴포넌트

   주소에 따라 각각의 컴포넌트 호출

5. components의 js => Pages의 js

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



## 라이브러리

Material-UI 사용

### 색상

```
import { palette } from '@material-ui/system';
```

```
<Box color="text.primary">
<Box color="text.secondary">
<Box color="text.disabled">
```

