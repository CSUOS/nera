# NERA

**oNlinE Realtime Assignment**

서울시립대 컴퓨터과학부 실시간 과제 제출 및 관리 플랫폼

[WIKI](https://www.notion.so/WIKI-bc4777a260594cc6b17d9e46ede69c94)

## 룰

1. `master`를 제외한 나머지 `branch`에서는 자유롭게 커밋 (`fork`도 가능)
2. `master`랑 `merge`하려면 `pull request` (이하 PR) 넣기
3. 본인을 제외한 나머지 멤버가 변경내용 검토후 `merge` 
   1. Squash&merge, Rebase가 아닌 일반 merge 사용할 것



## 디렉토리

```
.github/workflows
  ㄴ Actions 기능을 사용한 CI 관련 파일 존재
.vscode
  ㄴ 디버깅 관련 vscode 설정파일 존재
page
  ㄴ 프론트엔드 관련 프로젝트. React로 진행중
server
  ㄴ 백엔드 관련 프로젝트. Koa로 진행중
```



## DEV환경 구축

본 프로젝트는 `yarn`을 사용하는것을 전제로 진행하고 있습니다.

각 프로젝트 폴더에 들어가서 `yarn`입력으로 필요 모듈을 설치한 후 아래 명령어를 사용하시면 됩니다.

### page

`yarn start`: `React` 개발서버 시작

`yarn build`: 정적파일 만들기

`yarn test`: 유닛테스트 실행

### server

`yarn start`: `prod`서버 시작.

`yarn dev`: `dev`서버 시작. (파일변경 감지 시 자동 재시작)

`yarn test`: 유닛테스트 실행
