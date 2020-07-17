import React from 'react';
import {LectureInfo, BottomPopup, AssignmentBox} from "../components";

import { Grid } from '@material-ui/core';

const Lecture = (props)=>{
  const lecture = props.lecture;
  const lect_num = props.number;
  
  return (
    <Grid container direction="column" spacing={24}>
      <LectureInfo title={lecture[lect_num][0]} prof={lecture[lect_num][2]}/>
      <BottomPopup link="#"></BottomPopup>
      
      <div className="a_subheader"><h6>최근 채점된 과제</h6></div>
      <div className="assignment_rootbox">
          <AssignmentBox/>
          <AssignmentBox/>
          <AssignmentBox/>
      </div>
    </Grid>
  )
}

export default Lecture;