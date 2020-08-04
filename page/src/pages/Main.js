import React from 'react';
import {SideBar, Header} from "../components";
import {Home, Assignment, Setting, Error, SubmissionStatus, SetAssignment, Scoring, SetStudentList} from "../pages";
import "./pages.css";

import clsx from 'clsx';
import { Grid } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


// style definition

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


// main pages

function Main(props){

      // get data from USERINFOSERVER => save in cookie

    /*
    let main_info = {
      "id": props.location.state.id, 
      "name" :props.location.state.name, 
      "user_number" :  props.location.state.user_number,
      "type" : props.location.state.type,
      "major": props.location.state.major
    }*/
    
    // 쿠키에 저장된 정보
    let main_info={
      "id": 1,
      "name":"우희은",
      "user_number" : "2017920038",
      "type" : 0, // 교수 : 0 , 학생 : 1
      "major" : "컴퓨터과학부",
      "meta": {
        "create_at": new Date('2020-03-01T11:59:00'),
        "modified_at": new Date('2020-03-01T11:59:00'),
      }
    }
    
    const type = main_info.type;
    


      // get assignment data from NERA server

    // [assignment_info의 값 종류]
    // 학생일 경우 0: 제출 필요(secondary), 1: 제출 완료(green), 2: 채점 중(primary), 3: 채점 완료(black)
    // 교수일 경우 0: 마감 전(green), 1: 마감 후 채점 전(secondary), 2: 마감 후 채점 후(black)

    const sampleNames = ["가정현", "나정현", "다정현", "라정현", "마정현", "바정현", "사정현"];
    const sampleNumbers = [2019920001, 2019920002, 2019920003, 2019920004, 2019920005, 2019920006, 2019920007];

    let assignment = [
      {
        "assignment_id": 0,
        "assignment_name": "[컴퓨터보안] SHA256 구현",
        "deadline": new Date('2020-08-13T11:59:00'),
        "assignment_state": 0,
        "assignment_info": "코드는 반드시 C++로 작성해주세요.",
        "full_score": 30,
        "questions": [],
        "score": 28,
        "students": JSON.parse(JSON.stringify(sampleNumbers)),
        "meta": {
          "create_at": new Date('2020-08-01T11:59:00'),
          "modified_at": new Date('2020-08-01T11:59:00'),
        }
      },
      {
        "assignment_id": 1,
        "assignment_name": "[컴퓨터알고리즘] 퀵 소트 구현",
        "deadline": new Date('2020-08-21T11:59:00'),
        "assignment_state": 2,
        "assignment_info": "코드는 C언어 또는 C++로 작성해주세요.",
        "full_score": 30,
        "questions": [],
        "score": 20,
        "students": JSON.parse(JSON.stringify(sampleNumbers)),
        "meta": {
          "create_at": new Date('2020-08-01T11:59:00'),
          "modified_at": new Date('2020-08-01T11:59:00'),
        }
      },
      {
        "assignment_id": 2,
        "assignment_name": "[컴퓨터알고리즘] 쉘 소트 구현",
        "deadline": new Date('2020-08-25T11:59:00'),
        "assignment_state": 1,
        "assignment_info": "코드는 C언어 또는 C++로 작성해주세요.",
        "full_score": 30,
        "questions": [],
        "score": 20,
        "students": JSON.parse(JSON.stringify(sampleNumbers)),
        "meta": {
          "create_at": new Date('2020-08-01T11:59:00'),
          "modified_at": new Date('2020-08-01T11:59:00'),
        }
      },
      {
        "assignment_id": 3,
        "assignment_name": "[컴퓨터알고리즘] 힙 소트 구현",
        "deadline": new Date('2020-08-27T11:59:00'),
        "assignment_state": 3,
        "assignment_info": "코드는 C언어 또는 C++로 작성해주세요.",
        "full_score": 30,
        "questions": [],
        "score": 20,
        "students": JSON.parse(JSON.stringify(sampleNumbers)),
        "meta": {
          "create_at": new Date('2020-08-01T11:59:00'),
          "modified_at": new Date('2020-08-01T11:59:00'),
        }
      }
    ];

    let q = [{
      "question_id": 0,
      "question_content": "SHA에 대해 조사하세요.",
      "full_score": 60,
      "question_answer": [],
      "meta": {
        "create_at": new Date('2020-08-01T11:59:00'),
        "modified_at": new Date('2020-08-01T11:59:00'),
      }
    },
    {
      "question_id": 1,
      "question_content": "SHA에 대해 조사하세요.(2)",
      "full_score": 60,
      "question_answer": [],
      "meta": {
        "create_at": new Date('2020-08-01T11:59:00'),
        "modified_at": new Date('2020-08-01T11:59:00'),
      }
    },
    {
      "question_id": 2,
      "question_content": "퀵 소트에 대해 조사하세요.",
      "full_score": 60,
      "question_answer": [],
      "meta": {
        "create_at": new Date('2020-08-01T11:59:00'),
        "modified_at": new Date('2020-08-01T11:59:00'),
      }
    },
    {
      "question_id": 3,
      "question_content": "C/C++로 퀵 소트를 구현하세요.",
      "full_score": 60,
      "question_answer": [],
      "meta": {
        "create_at": new Date('2020-08-01T11:59:00'),
        "modified_at": new Date('2020-08-01T11:59:00'),
      }
    },
    {
      "question_id": 4,
      "question_content": "쉘 소트에 대해 조사하세요.",
      "full_score": 60,
      "question_answer": [],
      "meta": {
        "create_at": new Date('2020-08-01T11:59:00'),
        "modified_at": new Date('2020-08-01T11:59:00'),
      }
    },
    {
      "question_id": 5,
      "question_content": "C/C++로 쉘 소트를 구현하세요.",
      "full_score": 60,
      "question_answer": [],
      "meta": {
        "create_at": new Date('2020-08-01T11:59:00'),
        "modified_at": new Date('2020-08-01T11:59:00'),
      }
    },
    {
      "question_id": 6,
      "question_content": "힙 소트에 대해 조사하세요.",
      "full_score": 60,
      "question_answer": [],
      "meta": {
        "create_at": new Date('2020-08-01T11:59:00'),
        "modified_at": new Date('2020-08-01T11:59:00'),
      }
    },
    {
      "question_id": 7,
      "question_content": "C/C++로 힙 소트를 구현하세요.",
      "full_score": 60,
      "question_answer": [],
      "meta": {
        "create_at": new Date('2020-08-01T11:59:00'),
        "modified_at": new Date('2020-08-01T11:59:00'),
      }
    }];

    for (let i = 0; i < q.length; ++i)
    {
      for (let j = 0; j < sampleNames.length; ++j)
      {
        q[i].question_answer.push({
          "user_number": sampleNumbers[j],
          "question_id": assignment[Math.floor(i/2)].assignment_id * 1000 + q[i].question_id,
          "name": sampleNames[j],
          "answer_content": [`${sampleNames[j]}의 ${i%2 + 1}번 문제에 대한 답입니다.`],
          "submitted": (j % 2 == 0 ? true : false),
          "score": Math.floor(q[i].full_score / (j+1)),
          "meta": {
            "create_at": new Date('2020-08-02T11:59:00'),
            "modified_at": new Date('2020-08-02T11:59:00')
          }
        });
      }
      assignment[Math.floor(i/2)].questions.push(q[i]);
    }


      // 개별 component로 넘길 data들 정리
    // SideBar로 넘길 "과제 제목"들
    const s_assignment = [];
    for(let i=0; i<assignment.length; i++){
      // id: 0, title : 1, state : 2
      s_assignment.push([assignment[i].assignment_id, assignment[i].assignment_name, assignment[i].assignment_state]);
    }


    const findAssignmentById = (id, asList) => {
      for (let i = 0; i < asList.length; ++i)
        if (asList[i]["assignment_id"] === id)
          return asList[i];

      return undefined;
    }

    const isAbleToMark = (asId, userNumber) => {
      let submittedCount = 0;
      for (const ques of assignment[asId].questions)
        for (const answer of ques.question_answer) 
          if (userNumber == answer.user_number && answer.submitted)
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
    }

      // select contents from url

    let contents;
    const component = props.match.params.component;
    const sub = props.match.params.sub;
    const last = props.match.params.last;

    // type이 없으면 재로그인 요청 => 쿠키 완성 시 추가하기
    
    // url의 (type, component)에 따라 component 분리
    if(component==undefined){
      
      const home_assignment = [];
      for(let i=0; i<assignment.length; i++){
        // id: 0, deadline : 1, title : 2, state : 3, score : 4
        home_assignment.push([assignment[i].assignment_id, assignment[i].deadline, assignment[i].assignment_name, assignment[i].assignment_state, assignment[i].score]);
      }
  

      contents=
      <Home
        type={type}
        main_info={main_info}
        as_info ={home_assignment}
      />;
    }else{
      if(type==1){ // 학생이면
        if(component=="assignment"){
          if(sub!=undefined){
            // sub이 있으면
            contents=
            <Assignment
              info={findAssignmentById(Number(sub), assignment)}
            />   ;
          }else{
            // sub이 없으면
            contents = <Error/>; // 나중에 아예 redirection으로 error page를 새로 생성해도됨
          }
        }else{
          contents = <Error/>;
        }
      }
      else if(type==0){ // 교수이면
        switch(component){
          case "assignment":
            if(sub!=undefined){
              contents = <SubmissionStatus info={findAssignmentById(Number(sub), assignment)}/>;  
            }else{
              contents = <Error/>;
            }
            break;

          case "setting":
            if(sub!=undefined){
              if(sub==="add"){
                contents= <SetAssignment/>;
              }else{
                contents=
                <SetAssignment
                  as_info={assignment[sub]}
                />;  
              }
            }else{
              contents = <Setting
                as_info={assignment}
              />;
            }
            break;
          
          case "scoring":
            if (sub != undefined && last != undefined && isAbleToMark(Number(sub), Number(last)))
              contents = <Scoring info={selectAnswers(Number(sub), Number(last))} number={Number(last)}/>
            else
              contents = <Error/>
            break;
          
          case "setList":
            if(sub!=undefined){
              contents = <Error/>;
            }else{
              contents = <SetStudentList/>;
            }
            break;

          default:
            contents = <Error/>;
        }
      }else{
        contents = <Error/>;
      }
    }

      // drawer 코드
    const classes = useStyles();
    const [open, setOpen] = React.useState(false); // header와 drawer에 동시 적용되어야하기 때문에 Main에 저장

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    


      // rendering

    return (
        <Grid container>
            <CssBaseline />
            <Header
              drawerOpen={handleDrawerOpen}
              open={open}
              type={type}
              name={main_info.name}
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