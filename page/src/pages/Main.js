import React from 'react';
import {SideBar, Header} from "../components";
import {Home, Assignment, Part} from "../pages";
import "./pages.css";

import clsx from 'clsx';
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


// data
  
const type_num = 1;
const name = '우희은';
const student_number = '2017920038';
const age = '24';
const type = type_num?'학생':'교수';
const major = '컴퓨터과학부';
const lecture =[['이산수학','01', '김민호'],['선형대수','01', '김민호']];

// main pages

const Main = ({match}, props)=>{
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const user_type = match.params.admin;

    // side_bar
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
              name={name}
              number={student_number}
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
                  name={name}
                  number={student_number}
                />
            </Drawer>
            <div
               className={clsx(classes.content, {
                [classes.contentShift]: open,
              }, "margin-top-64", "contents_side")}
            >
              {
              // Home / Lecture / Assignment
              isNaN(Number(match.params.as_id))?
              <Home
                lecture={lecture} 
                name={name} 
                number={student_number}
                type={type}
                major={major}
              />
              :(
                isNaN(Number(match.params.pt_id))?
                <Assignment
                  title={"Assignment #" + Number(match.params.as_id)}
                  lectureId={match.params.id}
                  assignmentId={match.params.as_id}
                />                  
                :
                <Part
                  title={"Assignment #" + Number(match.params.as_id) + "의 Part " + Number(match.params.pt_id)}
                  lastSaveDate={new Date('2020-08-31T11:59:00')}
                  totalCount={2}
                  solvedCount={1}
                />
              )}
            </div>
        </div>
    )
}

export default Main