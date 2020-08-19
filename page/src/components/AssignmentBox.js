import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {Link} from 'react-router-dom';
import { Grid, Paper } from '@material-ui/core';

const AssignmentBox = (props)=>{
  const {type, as_info} = props;
  const state = as_info[3];
  const date = new Date(as_info[1]);
  const deadline = date.getFullYear() + "-" 
                + (date.getMonth()+1 <= 9 ? "0" : "") + (date.getMonth()+1) + "-"
                + (date.getDate() <= 9 ? "0" : "") + date.getDate() + " "
                + (date.getHours() <= 9 ? "0" : "") + date.getHours() + ":"
                + (date.getMinutes() <= 9 ? "0" : "") + date.getMinutes()

  let color="black";
  let state_word = "error";

  if(type===0){
    switch(state){
      case 0: state_word="공개 전"; color = "rgb(56, 142, 60)"; break;
      case 1: state_word="진행 중"; color = "#f50057"; break;
      case 2: state_word="마감 됨"; color = "black"; break;
    }
  }else if(type===1){
    switch(state){
      // case 0: state_word="제출 필요"; color = "#f50057"; break;
      case 1: state_word="제출 필요"; color = "rgb(56, 142, 60)"; break;
      case 2: state_word="채점 중"; color = "#3f51b5"; break;
      case 3: state_word="채점 완료"; color = "black"; break;
    }
  }
  const useStyles = makeStyles((theme) => ({
    circleSytle : {
      background: color,
      padding: '5px 10px',
      color: 'white'
    }
  }));
  
  const classes = useStyles();

  
  return(
    <Paper className="assignment_box">
      <Link to ={"/home/assign/"+as_info[0]}>
            <Grid className="a_box_header">
              <Grid className="a_box_title">{as_info[2]}</Grid>
              <Grid className={classes.circleSytle}>{state_word}</Grid>
            </Grid>
            <Grid className="a_box_deadline">{deadline} 까지</Grid>
      </Link>
    </Paper>
  );
}

export default AssignmentBox;