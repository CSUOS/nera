

<p align="center">
      <h1 align="center">Backend 문서</h2>
	  <p align="center">
    	<a href="https://github.com/CSUOS/nera/issues">Report Bug</a>
  	  </p>
</p>

# 목차

* [서버 실행](#서버-실행)

* [디렉토리 구조](#디렉토리-구조)
* [API](#API)



# 서버 실행

server 디렉토리에서 다음의 명령어로 실행

* 기본

```
yarn start
```

* 개발 - 파일 변경 감지시 자동 재시작

```
yarn dev
```



# 디렉토리 구조

## server

* server.ts

* config.ts

* ## server

  * db.ts

  * index.ts

  * type.ts

  * ## v1

    * answer.ts
    * assignment.ts
    * authCheck.ts
    * cookieTest.ts
    * login.ts
    * logout.ts
    * student.ts
    * token.ts
    * userInfo.ts

    * ## models

      * answerPaperModel.ts
      * assignmentModel.ts
      * groupModel.ts
      * meta.ts

***

### server.ts

서버 구동 파일



### config.ts

Vault 서버에 요청을 보내 환경변수를 가져오는 파일



### db.ts

DB 연동 파일



### index.ts

인덱스 파일



### type.ts

타입 정의 파일



### answer.ts

답안 관련 API 파일



### assignment.ts

과제 관련 API 파일



### auhCheck.ts

로그인이 필요한 API 들을 묶은 라우터 파일



### cookieTest.ts

디버그용 계정 토큰 발급 파일



### login.ts

로그인 관련 API 파일



### logout.ts

로그아웃 관련 API 파일



### student.ts

수강생 목록 관련 API 파일



### token.ts

로그인시 프론트에서 비밀번호 암호화를 위한 토큰을 발급하는 API 파일



### userInfo.ts

유저 정보 반환 API 파일



### answerPaperModel.ts

답안 스키마를 정의해놓은 파일



### assignmentModel.ts

과제 스키마를 정의해놓은 파일



### groupModel.ts

수강생 목록 스키마를 정의해놓은 파일



### meta.ts

이외에 필요한 함수, 객체들을 정의해놓은 파일

***

# API 

## `POST`

<details style="background-color:white;">
    <summary style="background-color:#009d77; font-size:24px; color:white">/v1/login</summary>
    <div>
    	<div style="padding:10px; font-weight:bold;">
    		로그인 api    
    	</div>
		<div style="padding:10px; font-weight:bold">
    		요청 예시
            <pre style="padding:10px;">
{
	"userIw": "아이디",
    "userPw": "비밀번호"
}
            </pre>
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    200 - 정상 처리
                </div>
            	<pre style="padding:10px;">
{
	"userId": "아이디",
    "userName": "홍길동",
    "userNumber": 2016920003,
}
            	</pre>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    400 - 잘못된 요청
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    403 - 인증 실패
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

<details style="background-color:white;">
    <summary style="background-color:#009d77; font-size:24px; color:white">/v1/logut</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		로그아웃 api    
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    204 - 정상 처리
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

<details style="background-color:white;">
    <summary style="background-color:#009d77; font-size:24px; color:white">/v1/assignment</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		과제 생성, 수정 api    
    	</div>
		<div style="padding:10px; font-weight:bold">
    		요청 예시
            <pre style="padding:10px;">
{
	"assignmentId": -1,(생성: -1, 수정: 자연수)
	"students": [
    	2016920001,
    	2016920002,
    	2016920003,
  	],
  	"assignmentName": "과제 이름",
   	"assignmentInfo": "과제 정보",
    "publishingTime": "2020-08-05T05:03:01.292Z",
    "deadline": "2020-08-05T05:03:01.292Z",
    "questions": [
      {
        "questionContent": "1+1 은?",
        "fullScore": 30
      }
    ]
}
            </pre>
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    200 - 정상 처리
                </div>
            	<pre style="padding:10px;">
{
    "meta": {
        "createdAt": "2020-08-28T15:40:17.331Z",
        "modifiedAt": "2020-08-29T13:31:15.926Z"
    },
    "students": [
        2016920001,
        2016920002,
        2016920003,
    ],
    "questions": [
        {
            "questionId": 0,
            "questionContent": "1+1은?",
            "fullScore": 30
        }
    ],
    "professorNumber": 1016920003,
    "assignmentName": "과제 이름",
    "assignmentInfo": "과제 정보",
    "publishingTime": "2020-08-28T06:43:33.265Z",
    "deadline": "2020-08-31T06:43:00.000Z",
    "assignmentId": 4,
    "assignmentState": 1
}
            	</pre>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    400 - 잘못된 요청
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    403 - 권한 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

<details style="background-color:white;">
    <summary style="background-color:#009d77; font-size:24px; color:white">/v1/answer/{assignmentId}</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		답안 생성, 수정 api    
    	</div>
		<div style="padding:10px; font-weight:bold">
    		요청 예시
            <pre style="padding:10px;">
{
  	"answers": [
    	{
      		"questionId": 0,
      		"answerContent": "답안1"
    	},
    	{
    		"questionId": 1,
      		"answerContent": "답안2"
    	}
  	]
}
            </pre>
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    200 - 정상 처리
                </div>
            	<pre style="padding:10px;">
{
    "meta": {
        "createdAt": "2020-08-29T16:15:00.526Z",
        "modifiedAt": "2020-08-29T16:15:00.527Z"
    },
    "answers": [
        {
            "score": -1,
            "questionId": 0,
            "answerContent": "답안1"
        }
    ],
    "userNumber": 2016920003,
    "professorNumber": 1016920003,
    "assignmentId": 4,
}
            	</pre>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    400 - 잘못된 요청
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    403 - 권한 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    404 - 찾을 수 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

<details style="background-color:white;">
    <summary style="background-color:#009d77; font-size:24px; color:white">/v1/answer/{assignmentId}/{userNumber}</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		채점 api    
    	</div>
		<div style="padding:10px; font-weight:bold">
    		요청 예시
            <pre style="padding:10px;">
{
  	"answers": [
    	{
      		"questionId": 0,
      		"score": 20
    	},
    	{
    		"questionId": 1,
      		"score": 30
    	}
  	]
}
            </pre>
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    200 - 정상 처리
                </div>
            	<pre style="padding:10px;">
{
    "meta": {
        "createdAt": "2020-08-29T16:15:00.526Z",
        "modifiedAt": "2020-08-29T16:15:00.527Z"
    },
    "answers": [
        {
            "questionId": 0,
            "answerContent": "답안1",
            "score": 20,
        },
        {
            "questionId": 1,
            "answerContent": "답안2",
            "score:" 30,
        }
    ],
    "userNumber": 2016920003,
    "professorNumber": 1016920003,
    "assignmentId": 4,
}
            	</pre>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    400 - 잘못된 요청
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    403 - 권한 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    404 - 찾을 수 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

<details style="background-color:white;">
    <summary style="background-color:#009d77; font-size:24px; color:white">/v1/student</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		수강생 목록 생성, 수정 api  
    	</div>
		<div style="padding:10px; font-weight:bold">
    		요청 예시
            <pre style="padding:10px;">
{
  	"groupId": -1, (생성: -1, 수정: 자연수)
  	"className": "이산 수학",
  	"students": [
  		2016920001,
  		2016920002,
  		2016920003,
  	]
}
            </pre>
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    200 - 정상 처리
                </div>
            	<pre style="padding:10px;">
{
    "groupId": 0,
    "className": "이산 수학",
    "professorNumber": 1016920003,
    "students": [
    	2016920001,
    	2016920002,
    	2016920003
    ],
    "meta": {
        "createdAt": "2020-08-28T15:40:17.331Z",
        "modifiedAt": "2020-08-29T13:31:15.926Z"
    }
}
            	</pre>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    400 - 잘못된 요청
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    403 - 권한 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    404 - 찾을 수 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>



## `GET`

<details style="background-color:white;">
    <summary style="background-color:#1391ff; font-size:24px; color:white">/v1/assignment</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		전체 과제 조회 api
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    200 - 정상 처리
                </div>
            	<pre style="padding:10px;">
[
    {
        "meta": {
            "createdAt": "2020-08-28T15:40:17.331Z",
            "modifiedAt": "2020-08-29T13:31:15.926Z"
        },
        "students": [
            2016920001,
            2016920002,
            2016920003,
        ],
        "questions": [
            {
                "questionId": 0,
                "questionContent": "1+1은?",
                "fullScore": 30
            }
        ],
        "professorNumber": 1016920003,
        "assignmentName": "과제 이름",
        "assignmentInfo": "과제 정보",
        "publishingTime": "2020-08-28T06:43:33.265Z",
        "deadline": "2020-08-31T06:43:00.000Z",
        "assignmentId": 4,
        "assignmentState": 1
    }
]
            	</pre>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    404 - 찾을 수 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

<details style="background-color:white;">
    <summary style="background-color:#1391ff; font-size:24px; color:white">/v1/assignment/{assignmentId}</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		과제 조회 api
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    200 - 정상 처리
                </div>
            	<pre style="padding:10px;">
 {
     "meta": {
         "createdAt": "2020-08-28T15:40:17.331Z",
         "modifiedAt": "2020-08-29T13:31:15.926Z"
     },
     "students": [
         2016920001,
         2016920002,
         2016920003,
     ],
     "questions": [
         {
             "questionId": 0,
             "questionContent": "1+1은?",
             "fullScore": 30
         }
     ],
     "professorNumber": 1016920003,
     "assignmentName": "과제 이름",
     "assignmentInfo": "과제 정보",
     "publishingTime": "2020-08-28T06:43:33.265Z",
     "deadline": "2020-08-31T06:43:00.000Z",
     "assignmentId": 4,
     "assignmentState": 1
 }
            	</pre>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    400 - 잘못된 요청
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    404 - 찾을 수 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

<details style="background-color:white;">
    <summary style="background-color:#1391ff; font-size:24px; color:white">/v1/answer/{assignmentId}</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		학생이 본인의 답안 조회 api
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    200 - 정상 처리
                </div>
            	<pre style="padding:10px;">
{
  	"professorNumber": 0,
  	"userNumber": 0,
  	"assignmentId": 0,
  	"answers": [
 		{
 	    	"questionId": 0,
      		"answerContent": "string",
      		"score": 0
    	}
  	],
  	"meta": {
    	"createAt": "2020-08-29T10:46:19.543Z",
    	"modifiedAt": "2020-08-29T10:46:19.543Z"
  	}
}
            	</pre>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    404 - 찾을 수 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

<details style="background-color:white;">
    <summary style="background-color:#1391ff; font-size:24px; color:white">/v1/answer/{assignmentId}/{userNumber}</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		교수가 학생의 답안 조회 api
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    200 - 정상 처리
                </div>
            	<pre style="padding:10px;">
{
  	"professorNumber": 0,
  	"userNumber": 0,
  	"assignmentId": 0,
  	"answers": [
 		{
 	    	"questionId": 0,
      		"answerContent": "string",
      		"score": 0
    	}
  	],
  	"meta": {
    	"createAt": "2020-08-29T10:46:19.543Z",
    	"modifiedAt": "2020-08-29T10:46:19.543Z"
  	}
}
            	</pre>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    400 - 잘못된 요청
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    403 - 권한 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    404 - 찾을 수 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

<details style="background-color:white;">
    <summary style="background-color:#1391ff; font-size:24px; color:white">/v1/student</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		수강생 목록 조회 api
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    200 - 정상 처리
                </div>
            	<pre style="padding:10px;">
[
    {
        "groupId": 0,
        "className": "이산 수학",
        "professorNumber": 1016920003,
        "students": [
            2016920001,
            2016920002,
            2016920003
        ]
        "meta": {
            "createAt": "2020-08-29T10:46:19.543Z",
            "modifiedAt": "2020-08-29T10:46:19.543Z"
        }
    }
]
            	</pre>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    400 - 잘못된 요청
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    403 - 권한 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    404 - 찾을 수 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

<details style="background-color:white;">
    <summary style="background-color:#1391ff; font-size:24px; color:white">/v1/userInfo</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		유저 정보 조회 api
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    200 - 정상 처리
                </div>
            	<pre style="padding:10px;">
{
	"userId": "아이디",
	"userName": "홍길동",
	"userNumber": 2016920003
}
            	</pre>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

<details style="background-color:white;">
    <summary style="background-color:#1391ff; font-size:24px; color:white">/v1/token</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		토큰 조회 api
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    200 - 정상 처리
                </div>
            	<pre style="padding:10px;">
"토큰"
            	</pre>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
                        <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    404 - 찾을 수 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>



## `DELETE`

<details style="background-color:white;">
    <summary style="background-color:#cf3030; font-size:24px; color:white">/v1/assignment/{assignmentId}</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		과제 삭제 api
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    204 - 정상 처리
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    400 - 잘못된 요청
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
                        <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    403 - 권한 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

<details style="background-color:white;">
    <summary style="background-color:#cf3030; font-size:24px; color:white">/v1/student/{groupId}</summary>
    <div>
    	<div style="padding:10px; font-weight:bold">
    		그룹 삭제 api
    	</div>
        <div style="padding:10px; font-weight:bold">
    		응답
            <div style="padding:10px">
                <div style="padding:10px;background:#81c147;color:white">
                    204 - 정상 처리
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    400 - 잘못된 요청
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    401 - 인증 실패
                </div>
            </div>
                        <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    403 - 권한 없음
                </div>
            </div>
            <div style="padding:10px">
                <div style="padding:10px;background:red;color:white">
                    500 - 내부 서버 오류
                </div>
            </div>
    	</div>
    </div>
</details>

