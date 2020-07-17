import React from 'react';
import {LectureInfo, AssignmentBox} from "../components";

import { Grid } from '@material-ui/core';

const Lecture = (props)=>{
  const lecture = props.lecture;
  const lect_num = props.number-1;
  
  return (
    <Grid container direction="column" spacing={24}>
      <LectureInfo title={lecture[lect_num][0]} prof={lecture[lect_num][2]}/>
      <Grid container direction="column" className="contents_con">
        <div className="contents_title"><h6>진행중인 과제</h6></div>
        <div className="assignment_rootbox">
            <AssignmentBox/>
            <AssignmentBox/>
        </div>
      </Grid>
      <Grid container direction="column" className="contents_con">
        <div className="contents_title"><h6>최근 채점된 과제</h6></div>
        <div className="assignment_rootbox">
            <AssignmentBox/>
            <AssignmentBox/>
            <AssignmentBox/>
        </div>
      </Grid>
    </Grid>
  )
}

export default Lecture;