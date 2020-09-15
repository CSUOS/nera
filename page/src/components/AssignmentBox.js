import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useAssignmentState} from '../shared/AssignmentState';

import {Link} from 'react-router-dom';
import { Grid, Paper } from '@material-ui/core';

const AssignmentBox = (props)=>{
  const {type, as_info} = props;
  const state = as_info.assignmentState;
  const date = new Date(as_info.deadline);
  const deadline = date.getFullYear() + "-" 
                + (date.getMonth()+1 <= 9 ? "0" : "") + (date.getMonth()+1) + "-"
                + (date.getDate() <= 9 ? "0" : "") + date.getDate() + " "
                + (date.getHours() <= 9 ? "0" : "") + date.getHours() + ":"
                + (date.getMinutes() <= 9 ? "0" : "") + date.getMinutes()

  let color="black";
  let state_word = "error";

  const asState = useAssignmentState();

  if(type===0){
    switch(state){
      case asState["notReleased"]: state_word="공개 전"; color = "black"; break; // 검
      case asState["released"]: state_word="진행 중"; color = "rgb(56, 142, 60)"; break; // 초
      case asState["scoring"]: state_word="채점 필요"; color = "#f50057"; break; // 빨
      case asState["done"]: state_word="마감 됨"; color = "#3f51b5"; break; // 파
    }
  }else if(type===1){
    switch(state){
      case asState["notReleased"]: state_word="공개 전"; color = "black"; break;
      case asState["released"]: state_word="제출 필요"; color = "#f50057"; break;
      case asState["scoring"]: state_word="채점 중"; color = "rgb(56, 142, 60)"; break;
      case asState["done"]: state_word="채점 완료"; color = "#3f51b5"; break;
    }
  }
  const useStyles = makeStyles((theme) => ({
    stateSytle : {
      background: color,
      padding: '5px 10px',
      color: 'white'
    }
  }));
  
  const classes = useStyles();

  
  return(
    <Paper className="assignment_box">
      <Link to ={`/home/assignment/${as_info.assignmentId}`}>
            <Grid className="a_box_header">
              <Grid className="a_box_title">{as_info.assignmentName}</Grid>
              <Grid className={classes.stateSytle}>{state_word}</Grid>
            </Grid>
            <Grid className="a_box_deadline">{deadline} 까지</Grid>
      </Link>
    </Paper>
  );
}

export default AssignmentBox;