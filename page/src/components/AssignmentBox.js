import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


const AssignmentBox = (props)=>{
  const {type, assignment_info} = props;
  const state = assignment_info[3];
  const deadline = assignment_info[1].getFullYear() + "-" 
                + (assignment_info[1].getMonth()+1 <= 9 ? "0" : "") + (assignment_info[1].getMonth()+1) + "-"
                + assignment_info[1].getDate() + " "
                + assignment_info[1].getHours() + ":"
                + assignment_info[1].getMinutes()
                
  let color="black";
  let state_word = "error";

  if(type===0){
    switch(state){
      case 0: state_word="마감 전"; color = "green"; break;
      case 1: state_word="채점 전"; color = "red"; break;
      case 2: state_word="채점 완료"; color = "blue"; break;
    }
  }else if(type===1){
    switch(state){
      // 색 조절하기 (수정 필요)
      case 0: state_word="제출 필요"; color = "red"; break;
      case 1: state_word="제출 완료"; color = "green"; break;
      case 2: state_word="채점 중"; color = "green"; break;
      case 3: state_word="채점 완료"; color = "blue"; break;
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
      <div className="assignment_box">
          <div className="a_box_header">
            <div className="a_box_title">{assignment_info[2]}</div>
            <div className={classes.circleSytle}>{state_word}</div>
          </div>
          <div className="a_box_deadline">{deadline} 까지</div>
      </div>
  );
}

export default AssignmentBox