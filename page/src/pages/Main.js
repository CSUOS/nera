import React, { useState, useEffect } from 'react';
import { SideBar, Header, Loading } from "../components";
import { Home, Assignment, Setting, Error, SubmissionStatus, SetAssignment, Scoring, SetStudentList } from "../pages";
import { getUserInfo } from "../shared/GetUserInfo";
import "./pages.css";
import clsx from 'clsx';
import axios from "axios";
import { Route, Link } from 'react-router-dom';

import { Grid } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { set } from 'date-fns';
import { useHistory } from "react-router-dom";

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
  /* drawer 코드 */
  const classes = useStyles();
  const [open, setOpen] = useState(true); // header와 drawer에 동시 적용되어야하기 때문에 Main에 저장
  const [user, setUser] = useState(undefined);
  const [sideAssign, setSideAssign] = useState(undefined);
  const history = useHistory();

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    try{
      setUser(getUserInfo());
    }catch(err){
      history.push("/");
    }

    axios.get('/v1/assignment', { withCredentials: true })
      .then(res => {
        let assign = res.data;
        let sAssign = [];
        for (let i = 0; i < assign.length; i++) {
          // id: 0, title : 1, state : 2
          sAssign.push(
            [
              assign[i].assignmentId,
              assign[i].assignmentName,
              assign[i].assignmentState
            ]);
        }

        setSideAssign(sAssign);
      })
      .catch(err => {
        if(err.response==undefined){
          alert(`내부 함수 (Main.js => useEffect()) 문제입니다. 오류 수정 필요.`);
        }
        const status = err.response.status;
        if (status === 400 || status === 401) {
          alert(`과제 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
        }
        else if (status === 404) {
          alert("과제를 찾을 수 없습니다.");
        }
        else if (status === 500) {
          alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
        }
        history.push("/");
      })
  }, []);

  /* rendering */
  if (user == undefined || sideAssign == undefined)
    return (
        <Loading status="불러오는 중..."></Loading>
    );
  else
  return (
    <Grid container direction="column">
      {user == undefined || sideAssign == undefined ?
        <Loading status="과제 정보를 가져오는 중..."></Loading>
        :
        <React.Fragment>
          <CssBaseline />
          <Grid item>
            <Header
              drawerOpen={handleDrawerOpen}
              open={open}
              type={user.type}
              name={user.userName}
            />
          </Grid>
          <Grid container item>
            <Grid item>
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
                  type={user.type}
                  drawerClose={handleDrawerClose}
                  assignment_info={sideAssign}
                />
              </Drawer>
            </Grid>

            <Grid
              className={clsx(classes.content,
                classes.appBarShift,
                {
                  [classes.contentShift]: open,
                }, "margin-top-64", "contents_side")}
            >
              <Route exact path="/home" component={Home} />
              <Route exact path="/home/assignment/:asId" component={user.type === 1 ? Assignment : SubmissionStatus} />
              <Route exact path="/home/setting" component={Setting} />
              <Route exact path="/home/setting/:asId" component={SetAssignment} />
              <Route exact path="/home/setList" component={SetStudentList} />
              <Route exact path="/home/scoring/:asId/:userNumber" component={Scoring} />
            </Grid>

          </Grid>
        </React.Fragment>}
    </Grid>
  )
}

export default Main