<p align="center">
      <h1 align="center">Frontend 문서</h2>
	  <p align="center">
    	<a href="https://github.com/CSUOS/nera/issues">Report Bug</a>
  	  </p>
</p>
[v1.0.1]

# 목차

- [기술 스택](#기술 스택)
- [페이지 실행](#페이지-실행)
- [라우팅 구조](#라우팅-구조)



## 기술 스택

* React hook
* Typescript
* Eslint
* scss
* Context API (Flux pattern)



## 페이지 실행

page 디렉토리에서 다음의 명령어로 실행

```
yarn start (또는 npm start)
```



## 라우팅 구조

| url            | 설명                    | 컴포넌트                              |
| -------------- | ----------------------- | ------------------------------------- |
| /              | 로그인페이지            | Login                                 |
| /admin         | 관리자페이지            | Admin                                 |
| /main          | 메인페이지              | Main                                  |
| /error         | 에러페이지              | Error                                 |
| /as/:asId      | 과제 페이지             | Assignment<br />ProfAssignment        |
| /setting       | 과제 관리 페이지        | Setting<br />교수님만 접근 가능       |
| /setting/:asId | 과제 수정 페이지        | SetAssignment<br />교수님만 접근 가능 |
| /member        | 수강생 목록 관리 페이지 | SetMember<br />교수님만 접근 가능     |



## Model 흐름

1. 로그인하면 쿠키로 user setting
2. user가 세팅되면(변경되면)
   * user에 해당하는 assignment setting (question까지 있음)
   * user에 해당하는 group setting ( 교수만! )
3. assignment가 select 되면
   * selected된 assignment에 해당하는 answer setting