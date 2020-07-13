import { Box, Button, Grid } from '@material-ui/core';
import React from 'react';
import {LectureBox, AccountInfo, BottomPopup, SideBar, Header, AssignmentBox} from "../components";
import "./main.css"; import "./pages.css";
import Drawer from '@material-ui/core/Drawer';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';

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

  
const type_num = 1;
const data = {
  name:'우희은',
  student_number: '2017920038',
  age : '24',
  type: type_num?'학생':'교수',
  major : '컴퓨터과학부'
}

const Main = ({match}, props)=>{
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    

    return (
        <div className="main container">
            <CssBaseline />
            <Header
              drawerOpen={handleDrawerOpen}
              open={open}
              name={data.name}
              number={data.student_number}
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
                  drawerClose={handleDrawerClose}
                  name={data.name}
                  number={data.student_number}
                />
            </Drawer>
            <div
               className={clsx(classes.content, {
                [classes.contentShift]: open,
              }, "margin-top-64")}
            > 
              <Grid container direction="column" spacing={24}>
                  <AccountInfo name={data.name} number={data.student_number} kind={data.type} major = {data.major}></AccountInfo>
                  <div className="menu_title">
                    나의 강의 목록
                  </div>
                  <LectureBox title="이산수학 (01)" prof="정형구 교수님" link="#"/>
                  <LectureBox title="선형대수 (01)" prof="정형구 교수님" link="#"/>
                  <BottomPopup link="#"></BottomPopup>
                  
                  <div className="a_subheader"><h6>최근 채점된 과제</h6></div>
                  <div className="assignment_rootbox">
                    <AssignmentBox/>
                    <AssignmentBox/>
                    <AssignmentBox/>
                  </div>
              </Grid>
            </div>
        </div>
    )
}

export default Main