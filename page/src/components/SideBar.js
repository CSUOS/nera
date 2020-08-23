import React from 'react';
import {Link} from 'react-router-dom';
import "./components.css";

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Divider, ListSubheader, Grid } from '@material-ui/core';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    nested:{
        paddingLeft: theme.spacing(4)
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    }
  }));
  
const SideBar = (props) => {
    const classes = useStyles();
    const {type, drawerClose, assignment_info} = props;

    let primary_assignment = [];
    let secondary_assignment = [];

    assignment_info.map((as)=>{
        if(type===0){ // 교수 => 0만 마감 전
            switch(as[2]){
                case 0:
                    secondary_assignment.push(as);
                    break;
                case 1:
                    primary_assignment.push(as);
                    break;
                case 2:
                    secondary_assignment.push(as);
                    break;
            }
        }else if(type===1){ // 학생 => 0, 1이 마감 전
            switch(as[2]){
                case 0:
                    primary_assignment.push(as);
                    break;
                case 1:
                    primary_assignment.push(as);
                    break;
                case 2:
                    secondary_assignment.push(as);
                    break;
                case 3:
                    secondary_assignment.push(as);
                    break;
            }
        }
    })

    return (
        <Grid className="side_bar">
            <Grid className={clsx(classes.drawerHeader,"sideBar_header")}>
                <Link to="/home"><Grid className="NERA"><h1>NERA</h1></Grid></Link>
                <IconButton onClick={drawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </Grid>
            <Divider />

            <List
                subheader={
                    <ListSubheader component="div" id="subheader">
                        {type===1? "내 과제" : "출제한 과제"}    
                    </ListSubheader>
                }
            >
                {
                    primary_assignment.map((as) => 
                        <Link to={'/home/assignment/'+as[0]}>
                            <ListItem button className={classes.nested}>
                            <ListItemIcon>
                                {
                                type===0?
                                    (as[2]===0?<FiberManualRecordIcon style={{color:green[700]}}/>:
                                        (as[2]===1?<FiberManualRecordIcon color="secondary"/>:<FiberManualRecordIcon/>)
                                    )
                                    :(as[2]===0?<FiberManualRecordIcon color="secondary"/>: 
                                        (as[2]===1?<FiberManualRecordIcon style={{color:green[700]}}/>:
                                            (as[2]===2?<FiberManualRecordIcon color="primary"/>:<FiberManualRecordIcon/>)
                                            )
                                    )
                                }
                            </ListItemIcon>
                            <ListItemText primary={as[1]} />
                            </ListItem>
                        </Link>
                    )
                }
                {
                    secondary_assignment.map((as) => 
                        <Link to={'/home/assignment/'+as[0]}>
                            <ListItem button className={classes.nested}>
                            <ListItemIcon>
                                {
                                type===0?
                                    (as[2]===0?<FiberManualRecordIcon style={{color:green[700]}}/>:
                                        (as[2]===1?<FiberManualRecordIcon color="secondary"/>:<FiberManualRecordIcon/>)
                                    )
                                    :(as[2]===0?<FiberManualRecordIcon color="secondary"/>: 
                                        (as[2]===1?<FiberManualRecordIcon style={{color:green[700]}}/>:
                                            (as[2]===2?<FiberManualRecordIcon color="primary"/>:<FiberManualRecordIcon/>)
                                            )
                                    )
                                }
                            </ListItemIcon>
                            <ListItemText primary={as[1]} />
                            </ListItem>
                        </Link>
                    )
                }
            </List>
            
            {type === 0 ?
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
            </List> : undefined}
        </Grid>
    );
}
export default SideBar