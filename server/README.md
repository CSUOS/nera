## Server 폴더 관련사항 정리

# server 구동법

server 폴더가 현재 작업 디렉토리인 채로 yarn dev나 yarn start 명령 실행

# 폴더

* server

정적인 파일들을 담아두는 디렉토리

* v1

ver 1.0.0 파일들을 담아두는 디렉토리

* models

데이터 스키마를 정의해놓은 디렉토리

# 파일

* index.ts

서버를 구동한 후 localhost:3000 으로 접속할 시 나오는 기본 페이지

* api.ts

router의 동작을 확인하기 위한 테스트 페이지

* auth.ts

로그인, 로그아웃 api

수정 필요

* cookieTest.ts

테스트용 쿠키 발급 api

리포에 .env파일이 올라가지 않도록 설정해두었으므로 process.env.AccessSecretKey에 새로운 키 문자열을 넣어서 사용할 것

* student.ts

post - 그룹 생성, 수정, userNumber, className으로 중복 체크
요청 예시
```
{
  "className": "test용 목록",
  "students": [
  	2016920003,
  	2016920004
  	]
}
```

get - 그룹 조회

delete/{groupId} - 그룹 삭제

* assignment.ts

post - 과제 생성, 수정, userNumber, assignmentName으로 중복 체크
요청 예시
```
{
  "students": [
    2016920003,
    1016920003
  ],
  "assignmentName": "과제 이름임",
  "assignmentInfo": "과제 정보임",
  "publishingTime": "2020-08-05T05:03:01.292Z",
  "deadline": "2020-08-05T05:03:01.292Z",
  "questions": [
    {
      "questionContent": "문제임",
      "fullScore": 0
    }
  ]
}
```
get - 전체 과제 조회

get/{assignmentId} - 특정 과제 조회

delete - 과제 삭제

* answer.ts

post/{assignmentId} - 답안 생성, 수정, assignmentId와 본인의 userNumber로 중복 체크
요청 예시
```
{
  "answers": [
    {
      "questionId": 1525001,
      "answerContent": "답안1"
    },
    {
    "questionId": 1525002,
      "answerContent": "답안2"
    }
  ]
}

post/{assignmentId}/{userNumber} - 채점
요청 예시
```{
  "answers": [
    {
      "questionId": 1525001,
      "score": 100
    },
    {
      "questionId": 1525002,
      "score": 10
    }
  ]
}
```
get/{assignmentId} - 학생이 본인의 답안 조회

get/{assignmentId}/{userNumber} - 교수가 학생의 답안 조회

* anwerPaperModel.ts

답안 스키마

* assignmentModel.ts

과제 스키마

* groupModel.ts

그룹 스키마

* meta.ts

메타데이터 및 함수 정의
