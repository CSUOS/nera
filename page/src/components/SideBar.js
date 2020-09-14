import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import "./components.css";

import { Divider, ListSubheader, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      ...theme.mixins.toolbar
    }
  }));
  
const SideBar = (props) => {
    const classes = useStyles();    
    const {type, drawerClose, assignmentInfo} = props;
    const [update, forceUpdate] = useState(false); // rendering update용
    const [assignmentClass, setAsClass] = useState([[],[],[],[]]); 
    
    useEffect(()=>{
        function preProcessingAssign(){
            assignmentInfo.map((as)=>{
                let tmp = assignmentClass;
                tmp[as[2]].push(as);
                setAsClass(tmp);
            })
        };

        preProcessingAssign();
    },[])

    useEffect(()=>{
        forceUpdate(!update);
    },[assignmentClass])

    // 교수 => 0, 1 : 마감 전 / 2 : 마감 / 3: 채점 완료 => 2 중요 / 0,1 보통 / 3 
    // 학생 => 0 : 공개 전 / 1 : 진행 중 / 2: 마감 / 3 : 채점 완료 => 1,3 중요 / 2 보통 / 0 

    function getProfessorMenu(type){
        let result = [];
        console.log(assignmentClass);
        assignmentClass[type].map((as)=>{
            console.log(as);
            result.push(
                <Link to={'/home/assignment/'+as[0]}>
                    <ListItem button className="side_bar_list_item">
                        {
                            type===2?
                                <FiberManualRecordIcon color="secondary"/>
                                :type===1?
                                    <FiberManualRecordIcon style={{color:green[700]}}/>
                                    :type===3?
                                        <FiberManualRecordIcon color="primary"/>
                                        :<FiberManualRecordIcon/>
                        }
                        <ListItemText primary={as[1].length>20?as[1].substring(0,20)+"...":as[1]} />
                    </ListItem>
                </Link>
            );
        });
        console.log(result);
        return result;
    }
    function getStudentMenu(type){
        let result = [];
        assignmentClass[type].map((as)=>{
            result.push(
            <Link to={'/home/assignment/'+as[0]}>
                <ListItem button>
                    {
                        type===1?
                            <FiberManualRecordIcon color="secondary"/>
                            :type===3?
                                <FiberManualRecordIcon color="primary"/>
                                :type===2?
                                <FiberManualRecordIcon style={{color:green[700]}}/>
                                    :<FiberManualRecordIcon/>
                    }
                    <ListItemText primary={as[1]} />
                </ListItem>
            </Link>);
        });
        return result;
    }

    return (
        <Grid className="side_bar">
            <Grid className={clsx(classes.drawerHeader,"side_bar_header")}>
                <Link className="side_bar_logo" to="/home"><Grid className="NERA"><img src="../img/logo1.png"/></Grid></Link>
                <Button className="side_bar_close" onClick={drawerClose}><ArrowBackIcon/></Button>
            </Grid>
            <Divider />
            {
                type===0? // 교수일 때
                    <Grid>
                        <List
                            subheader={
                                <ListSubheader component="div" id="subheader">
                                    마감된 과제
                                </ListSubheader>
                            }
                        >
                        {getProfessorMenu(2)}
                        </List>
                        <List
                            subheader={
                                <ListSubheader component="div" id="subheader">
                                    마감 전 과제 
                                </ListSubheader>
                            }
                        >
                        {getProfessorMenu(1)}
                        {getProfessorMenu(0)}
                        </List>
                        <List
                            subheader={
                                <ListSubheader component="div" id="subheader">
                                    채점 완료한 과제 
                                </ListSubheader>
                            }
                        >
                        {getProfessorMenu(3)}
                        </List>
                    </Grid>
                : // 학생일 때
                    <Grid>
                        <List
                            subheader={
                                <ListSubheader component="div" id="subheader">
                                    진행 중인 과제
                                </ListSubheader>
                            }
                        >
                        {getStudentMenu(1)}
                        </List>
                        <List
                            subheader={
                                <ListSubheader component="div" id="subheader">
                                    채점 완료한 과제
                                </ListSubheader>
                            }
                        >
                        {getStudentMenu(3)}
                        </List>
                        <List
                            subheader={
                                <ListSubheader component="div" id="subheader">
                                    마감된 과제
                                </ListSubheader>
                            }
                        >
                        {getStudentMenu(2)}
                        </List>
                        <List
                            subheader={
                                <ListSubheader component="div" id="subheader">
                                    공개 전 과제
                                </ListSubheader>
                            }
                        >
                        {getStudentMenu(0)}
                        </List>
                    </Grid>
            }
            
            {
                type === 0 ?
                    <List
                    subheader={
                        <ListSubheader component="div" id="subheader">관리</ListSubheader>
                    }
                    >
                        <Link to='/home/setting'>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary="과제 관리" />
                            </ListItem>
                        </Link>
                        <Link to='/home/setList'>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary="수강생 목록 관리" />
                            </ListItem>
                        </Link>
                    </List> : undefined
            }
        </Grid>
    );
}
export default SideBar