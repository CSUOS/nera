import { Box, Button, Grid } from '@material-ui/core';
import React from 'react';
import {LectureBox, AccountInfo, BottomPopup, SideBar, Header} from "../components";
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
              setOpen ={setOpen}
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
                />
            </Drawer>
            <div
               className={clsx(classes.content, {
                [classes.contentShift]: open,
              }, "margin-top-64")}
            > 
              <Grid container direction="column" spacing={24}>
                  <AccountInfo name="김정현" status="학생 / 2019920017 / 컴퓨터과학부"></AccountInfo>
                  <div className="menu_title">
                    나의 강의 목록
                  </div>
                  <LectureBox title="이산수학 (01)" prof="정형구 교수님" link="#"/>
                  <LectureBox title="선형대수 (01)" prof="정형구 교수님" link="#"/>
                  <BottomPopup link="#"></BottomPopup>
              </Grid>
            </div>
        </div>
    )
}

export default Main