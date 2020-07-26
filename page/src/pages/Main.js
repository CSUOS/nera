import React from 'react';
import {SideBar, Header} from "../components";
import {Home, Assignment, PAssignment, Setting, Error} from "../pages";
import { Route, Switch } from 'react-router-dom';
import "./pages.css";

import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { array } from 'prop-types';


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
      "student_number" :  props.location.state.student_number,
      "type" : props.location.state.type,
      "major": props.location.state.major
    }*/
    
    // 쿠키에 저장된 정보
    let main_info={
      "id": 1,
      "name":"우희은",
      "student_number" : "2017920038",
      "type" : 1,
      "major" : "컴퓨터과학부"
    }
    
    const type = main_info.type;
    


      // get assignment data from NERA server

    let assignment=[
      {
        "assignment_id":1,
        "assignment_title":"[컴퓨터보안] SHA256 구현",
        "deadline": "2020-08-21",
        "assignment_state": 0,
        // js에 열거형이 없네요
        // 학생일 경우 0: 제출 필요, 1: 제출 완료, 2: 채점 중, 3: 채점 완료
        // 교수일 경우 0: 마감 전, 1: 마감 후 채점 전, 2: 마감 후 채점 후
        "assignment_info": "코드는 반드시 C++로 작성해주세요.",
        "points": 30,
        "question":[{}],
        "score": 28
      },
      {
        "assignment_id":2,
        "assignment_title":"[컴퓨터알고리즘] 퀵 소트 구현",
        "deadline": "2020-08-27",
        "assignment_state": 2,
        // js에 열거형이 없네요
        // 학생일 경우 0: 제출 필요, 1: 제출 완료, 2: 채점 중, 3: 채점 완료
        // 교수일 경우 0: 마감 전, 1: 마감 후 채점 전, 2: 마감 후 채점 후
        "assignment_info": "코드는 C언어 또는 C++로 작성해주세요.",
        "points": 30,
        "question":[{}],
        "score": 20
      },
      {
        "assignment_id":3,
        "assignment_title":"[컴퓨터알고리즘] 쉘 소트 구현",
        "deadline": "2020-08-27",
        "assignment_state": 1,
        // js에 열거형이 없네요
        // 학생일 경우 0: 제출 필요, 1: 제출 완료, 2: 채점 중, 3: 채점 완료
        // 교수일 경우 0: 마감 전, 1: 마감 후 채점 전, 2: 마감 후 채점 후
        "assignment_info": "코드는 C언어 또는 C++로 작성해주세요.",
        "points": 30,
        "question":[{}],
        "score": 20
      },
      {
        "assignment_id":4,
        "assignment_title":"[컴퓨터알고리즘] 힙 소트 구현",
        "deadline": "2020-08-27",
        "assignment_state": 3,
        // js에 열거형이 없네요
        // 학생일 경우 0: 제출 필요, 1: 제출 완료, 2: 채점 중, 3: 채점 완료
        // 교수일 경우 0: 마감 전, 1: 마감 후 채점 전, 2: 마감 후 채점 후
        "assignment_info": "코드는 C언어 또는 C++로 작성해주세요.",
        "points": 30,
        "question":[{}],
        "score": 20
      }
    ];
    let q_1 = {
      "question_id" : 1,
      "quesetion_title" : "",
      "question_contents" : "SHA에 대해 조사하세요.",
      "question_info" : "2 page 이상 필수",
      "question_points" : 60,
      "question_answer":[]
    };
    let q_2 = {
      "question_id" : 1,
      "quesetion_title" : "",
      "question_contents" : "SHA에 대해 조사하세요.",
      "question_info" : "2 page 이상 필수",
      "question_points" : 60,
      "question_answer":[]
    };
    assignment[0]["question"][0]=q_1;
    assignment[0]["question"][1]=q_2;


      // 개별 component로 넘길 data들 정리
    // SideBar로 넘길 "과제 제목"들
    const sb_assignment = [];
    for(let i=0; i<assignment.length; i++){
      // id: 0, title : 1, state : 2
      sb_assignment.push([assignment[i].assignment_id,assignment[i].assignment_title,assignment[i].assignment_state]);
    }




      // select contents from url

    let contents;
    const component = props.match.params.component;
    const assignment_id = props.match.params.as_id;

    // type이 없으면 재로그인 요청 => 추가하기
    
    // url의 (type, component)에 따라 component 분리
    if(component==undefined){
      
      const home_assignment = [];
      for(let i=0; i<assignment.length; i++){
        // id: 0, deadline : 1, title : 2, state : 3, score : 4
        home_assignment.push([assignment[i].assignment_id,assignment[i].deadline,assignment[i].assignment_title,assignment[i].assignment_state,assignment[i].score]);
      }
  

      contents=
      <Home
        type={type}
        main_info={main_info}
        assignment_info ={home_assignment}
      />;
    }else{
      if(type==1){ // 학생이면
        if(component=="assignment"){
          if(assignment_id!=undefined){
            // as_id이 있으면
            contents=
            <Assignment
              title={"Assignment #" + Number(assignment_id)}
              assignment_id={assignment_id}
              deadline={new Date('2020-08-31T11:59:00')}
            />   ;
          }else{
            // as_id이 없으면
            contents = <Error/>; // 나중에 아예 redirection으로 error page를 새로 생성해도됨
          }
        }else{
          contents = <Error/>;
        }
      }
      else if(type==0){ // 교수이면
        switch(component){
          case "assignment":
            if(assignment_id!=undefined){
              contents=<PAssignment/>;  
            }else{
              contents = <Error/>;
            }
            break;
          case "setting":
            if(assignment_id!=undefined){
              contents=
              <Setting 
                assignment_id={assignment_id}
              />;  
            }else{
              contents = <Setting/>;
            }
            break;
          case "submit": // 정현님 여기서 routing 수정하시면 됩니다. break 꼭 넣어주세요 :)
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
        <div className="main container">
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
                  assignment_info={sb_assignment}
                />
            </Drawer>
            <div
               className={clsx(classes.content, {
                [classes.contentShift]: open,
              }, "margin-top-64", "contents_side")}
            >
              {contents}
            </div>
        </div>
    )
}

export default Main