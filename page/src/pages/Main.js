import React, { useState } from 'react';
import { SideBar, Header } from "../components";
import { Home, Assignment, Setting, Error, SubmissionStatus, SetAssignment, Scoring, SetStudentList } from "../pages";
import "./pages.css";
import clsx from 'clsx';
import axios from "axios";

import { Grid } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


/* style definition => 대부분 css로 옮길 예정 */

const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(4),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));


/* main pages */
function Main(props) {

  /* get data from cookie */
  // 쿠키가 제대로 되어있지 않으면 login 페이지로 redirect 시키기
  console.log(document.cookie);

  /* using function */
  const findAssignmentById = (id, asList) => {
    for (let i = 0; i < asList.length; ++i)
      if (asList[i]["assignmentId"] === id)
        return asList[i];

    return undefined;
  }

  // isAbleToMark와 selectAnswers는 일시적으로 사용되지 않을 예정
  /*const isAbleToMark = (asId, userNumber) => {
    let submittedCount = 0;
    for (const ques of assignment[asId].questions)
      for (const answer of ques.questionAnswer)
        if (userNumber == answer.userNumber && answer.submitted)
          ++submittedCount;

    return submittedCount === assignment[asId].questions.length;
  }

  const selectAnswers = (asId, userNumber) => {
    let result = JSON.parse(JSON.stringify(assignment[asId]));

    for (let ques of result.questions) {
      let newAnswers = [];

      for (let answer of ques.question_answer) {
        if (answer.user_number === userNumber)
          newAnswers.push(JSON.parse(JSON.stringify(answer)));
      }

      ques.question_answer = newAnswers;
    }

    return result;
  }*/

  /* 지워야 할 부분 (임시 data) */

  // let user_info={
  //   //"id": 1,
  //   "name":"우희은",
  //   "user_number" : "2017920038",
  //   "type" : 0, // 교수 : 0 , 학생 : 1 // 도출해내야하는 정보
  //   "major" : "컴퓨터과학부", // 도출해내야하는 정보
  //   "meta": {
  //     "create_at": new Date('2020-03-01T11:59:00'),
  //     "modified_at": new Date('2020-03-01T11:59:00'),
  //   }
  // }

  // const type = user_info.type;

  //   // get assignment data from NERA server

  // // [assignment_info의 값 종류]
  // // 학생일 경우 0: 제출 필요(secondary), 1: 제출 완료(green), 2: 채점 중(primary), 3: 채점 완료(black)
  // // 교수일 경우 0: 마감 전(green), 1: 마감 후 채점 전(secondary), 2: 마감 후 채점 후(black)
  // // api 맞춰서 변경해야함

  // const sampleNames = ["가정현", "나정현", "다정현", "라정현", "마정현", "바정현", "사정현"];
  // const sampleNumbers = [2019920001, 2019920002, 2019920003, 2019920004, 2019920005, 2019920006, 2019920007];

  // let assignment = [
  //   {
  //     "assignment_id": 0,
  //     "professor" : 0,
  //     "students": JSON.parse(JSON.stringify(sampleNumbers)),
  //     "assignment_name": "[컴퓨터보안] SHA256 구현",
  //     "assignment_info": "코드는 반드시 C++로 작성해주세요.",
  //     "assignment_state": 0,
  //     "publishingTime" : new Date('2020-08-13T11:59:00'),
  //     "deadline" : new Date('2020-08-13T11:59:00'),
  //     "questions": [],
  //     "meta": {
  //       "create_at": new Date('2020-08-01T11:59:00'),
  //       "modified_at": new Date('2020-08-01T11:59:00'),
  //     }
  //   },
  //   {
  //     "assignment_id": 0,
  //     "professor" : 0,
  //     "students": JSON.parse(JSON.stringify(sampleNumbers)),
  //     "assignment_name": "[컴퓨터보안] SHA256 구현",
  //     "assignment_info": "코드는 반드시 C++로 작성해주세요.",
  //     "assignment_state": 0,
  //     "publishingTime" : new Date('2020-08-13T11:59:00'),
  //     "deadline" : new Date('2020-08-13T11:59:00'),
  //     "questions": [],
  //     "meta": {
  //       "create_at": new Date('2020-08-01T11:59:00'),
  //       "modified_at": new Date('2020-08-01T11:59:00'),
  //     }
  //   },
  //   {
  //     "assignment_id": 0,
  //     "professor" : 0,
  //     "students": JSON.parse(JSON.stringify(sampleNumbers)),
  //     "assignment_name": "[컴퓨터보안] SHA256 구현",
  //     "assignment_info": "코드는 반드시 C++로 작성해주세요.",
  //     "assignment_state": 0,
  //     "publishingTime" : new Date('2020-08-13T11:59:00'),
  //     "deadline" : new Date('2020-08-13T11:59:00'),
  //     "questions": [],
  //     "meta": {
  //       "create_at": new Date('2020-08-01T11:59:00'),
  //       "modified_at": new Date('2020-08-01T11:59:00'),
  //     }
  //   },
  //   {
  //     "assignment_id": 0,
  //     "professor" : 0,
  //     "students": JSON.parse(JSON.stringify(sampleNumbers)),
  //     "assignment_name": "[컴퓨터보안] SHA256 구현",
  //     "assignment_info": "코드는 반드시 C++로 작성해주세요.",
  //     "assignment_state": 0,
  //     "publishingTime" : new Date('2020-08-13T11:59:00'),
  //     "deadline" : new Date('2020-08-13T11:59:00'),
  //     "questions": [],
  //     "meta": {
  //       "create_at": new Date('2020-08-01T11:59:00'),
  //       "modified_at": new Date('2020-08-01T11:59:00'),
  //     }
  //   }
  // ];

  // let q = [{
  //   "question_id": 0,
  //   "question_content": "SHA에 대해 조사하세요.",
  //   "full_score": 60,
  //   "question_answer": [],
  //   "meta": {
  //     "create_at": new Date('2020-08-01T11:59:00'),
  //     "modified_at": new Date('2020-08-01T11:59:00'),
  //   }
  // },
  // {
  //   "question_id": 1,
  //   "question_content": "SHA에 대해 조사하세요.(2)",
  //   "full_score": 60,
  //   "question_answer": [],
  //   "meta": {
  //     "create_at": new Date('2020-08-01T11:59:00'),
  //     "modified_at": new Date('2020-08-01T11:59:00'),
  //   }
  // },
  // {
  //   "question_id": 2,
  //   "question_content": "퀵 소트에 대해 조사하세요.",
  //   "full_score": 60,
  //   "question_answer": [],
  //   "meta": {
  //     "create_at": new Date('2020-08-01T11:59:00'),
  //     "modified_at": new Date('2020-08-01T11:59:00'),
  //   }
  // },
  // {
  //   "question_id": 3,
  //   "question_content": "C/C++로 퀵 소트를 구현하세요.",
  //   "full_score": 60,
  //   "question_answer": [],
  //   "meta": {
  //     "create_at": new Date('2020-08-01T11:59:00'),
  //     "modified_at": new Date('2020-08-01T11:59:00'),
  //   }
  // },
  // {
  //   "question_id": 4,
  //   "question_content": "쉘 소트에 대해 조사하세요.",
  //   "full_score": 60,
  //   "question_answer": [],
  //   "meta": {
  //     "create_at": new Date('2020-08-01T11:59:00'),
  //     "modified_at": new Date('2020-08-01T11:59:00'),
  //   }
  // },
  // {
  //   "question_id": 5,
  //   "question_content": "C/C++로 쉘 소트를 구현하세요.",
  //   "full_score": 60,
  //   "question_answer": [],
  //   "meta": {
  //     "create_at": new Date('2020-08-01T11:59:00'),
  //     "modified_at": new Date('2020-08-01T11:59:00'),
  //   }
  // },
  // {
  //   "question_id": 6,
  //   "question_content": "힙 소트에 대해 조사하세요.",
  //   "full_score": 60,
  //   "question_answer": [],
  //   "meta": {
  //     "create_at": new Date('2020-08-01T11:59:00'),
  //     "modified_at": new Date('2020-08-01T11:59:00'),
  //   }
  // },
  // {
  //   "question_id": 7,
  //   "question_content": "C/C++로 힙 소트를 구현하세요.",
  //   "full_score": 60,
  //   "question_answer": [],
  //   "meta": {
  //     "create_at": new Date('2020-08-01T11:59:00'),
  //     "modified_at": new Date('2020-08-01T11:59:00'),
  //   }
  // }];

  // for (let i = 0; i < q.length; ++i)
  // {
  //   for (let j = 0; j < sampleNames.length; ++j)
  //   {
  //     q[i].question_answer.push({
  //       "user_number": sampleNumbers[j],
  //       "question_id": assignment[Math.floor(i/2)].assignment_id * 1000 + q[i].question_id,
  //       "name": sampleNames[j],
  //       "answer_content": [`${sampleNames[j]}의 ${i%2 + 1}번 문제에 대한 답입니다.`],
  //       "submitted": (j % 2 == 0 ? true : false),
  //       "score": Math.floor(q[i].full_score / (j+1) / (i%2 + 1)),
  //       "meta": {
  //         "create_at": new Date('2020-08-02T11:59:00'),
  //         "modified_at": new Date('2020-08-02T11:59:00')
  //       }
  //     });
  //   }
  //   assignment[Math.floor(i/2)].questions.push(q[i]);
  // }

  /* 지워야 할 부분 (임시 data) */

  var user_info = await axios.get('/v1/userInfo')
    .catch((e) => {
      const status = e.response.status;
      if (status === 401) {
        alert("사용자 정보를 얻는데 실패하였습니다. 잘못된 요청입니다.");
      }
      else if (status === 500) {
        alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...")
      }
      windows.location.href = "/";
    });

  var assignment = await axios.get('/v1/assignment')
    .catch((e) => {
      const status = e.response.status;
      if (status === 400 || status === 401) {
        alert("과제 정보를 얻는데 실패하였습니다. 잘못된 요청입니다.");
      }
      else if (status === 404) {
        alert("과제를 찾을 수 없습니다.");
      }
      else if (status === 500) {
        alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...")
      }
      windows.location.href = "/";
    });

  // 개별 component로 넘길 data들 정리
  // SideBar로 넘길 "과제 제목"들
  const s_assignment = [];
  for (let i = 0; i < assignment.length; i++) {
    // id: 0, title : 1, state : 2
    s_assignment.push(
      [
        assignment[i].assignmentId, 
        assignment[i].assignmentName, 
        assignment[i].assignmentState
      ]);
  }

  // home으로 넘길 정보 정리
  // id, deadline, name, state, score
  const home_assignment = [];
  for (let i = 0; i < assignment.length; i++) {
    home_assignment.push(
      [
        assignment[i].assignmentId,
        assignment[i].deadline,
        assignment[i].assignmentName,
        assignment[i].assignmentState,
        assignment[i].score
      ]);
  }

  /* select component from url */

  // url은 http://NERA서버/component/sub/last 순으로 구성되어있음
  const component = props.match.params.component;
  const sub = props.match.params.sub;
  const last = props.match.params.last;

  let contents;
  if (component == undefined) { // '/home' => Home.js

    // home component setting
    contents =
      <Home
        type={type}
        user_info={user_info}
        as_info={home_assignment}
      />;
  } else { // 'home/' => 여러 컴포넌트로 분리
    if (type == 1) { // 학생이면
      switch (component) {
        case "assignment": // 'home/assignment' => Assignment.js
          if (sub != undefined) { // 'home/assignment/:as_id' (as_id가 sub)
            contents =
              <Assignment
                info={findAssignmentById(Number(sub), assignment)}
              />;
          } else { // 'home/assignment' default page가 없음
            // 첫번째 과제 페이지로 redirect
            window.location.href = "/home/assignment/1";
          }
          break;
        default: // 학생은 현재 Assignment 컴포넌트 말고 다른 컴포넌트가 없음
          contents = <Error />;
      }
    } else if (type == 0) { // 교수이면
      switch (component) {
        case "assignment": // 'home/assignment' => SubmissionStatus.js
          if (sub != undefined) {
            contents = <SubmissionStatus info={findAssignmentById(Number(sub), assignment)} />;
          } else { // 'home/assignment' default page가 없음
            // 첫번째 과제 페이지로 redirect
            window.location.href = "/home/assignment/1";
          }
          break;

        case "setting":
          if (sub == undefined) { // 'home/setting' => Setting.js
            contents = <Setting
              as_info={assignment}
            />;
          } else {
            if (sub === "add") { // 'home/setting/add' => SetAssignment.js
              contents = <SetAssignment />;
            } else {
              // add가 아닌 Number type이면 해당 id의 과제 설정창 => SetAssignment.js
              contents =
                <SetAssignment
                  as_info={assignment[sub]}
                />;
            }
          }
          break;

        case "scoring": // 'home/scoring/sub/last' => Scoring.js
          // sub, last가 둘 다 존재할 때만 동작
          // sub : 과제 번호, last : 학번
          if (sub != undefined && last != undefined)
            // TODO: API와 동기화를 시키면서 isAbleToMark와 selectAnswers를 사용하지 않기로 했으므로, 
            // 그 컴포넌트의 코드를 수정해야 함.
            contents = <Scoring info={undefined} number={Number(last)} />
          else
            contents = <Error />
          break;

        case "setList": // 'home/setList' => SetStudentList.js
          if (sub != undefined) {
            contents = <Error />;
          } else {
            contents = <SetStudentList />;
          }
          break;

        default:
          contents = <Error />;
      }
    } else {
      contents = <Error />;
    }
  }

  /* drawer 코드 */
  const classes = useStyles();
  const [open, setOpen] = useState(false); // header와 drawer에 동시 적용되어야하기 때문에 Main에 저장

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };



  /* rendering */

  return (
    <Grid container>
      <CssBaseline />
      <Header
        drawerOpen={handleDrawerOpen}
        open={open}
        type={type}
        name={user_info.name}
      />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <SideBar
          type={type}
          drawerClose={handleDrawerClose}
          assignment_info={s_assignment}
        />
      </Drawer>
      <Grid
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        }, "margin-top-64", "contents_side")}
      >
        {contents}
      </Grid>
    </Grid>
  )
}

export default Main