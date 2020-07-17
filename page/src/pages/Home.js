import React from 'react';
import {LectureBox, AccountInfo, BottomPopup, AssignmentBox} from "../components";

import { Grid } from '@material-ui/core';

const Home = (props)=>{
    const lecture= props.lecture;

    //lecture_box data
    let lecture_list=[];
    let i=0;
    for(let lect of lecture){
        console.log(lect);
        let title = lect[0]+" ("+lect[1]+")";
        let professor = lect[2] + " 교수님";
        lecture_list[i++] = [title,professor];
    }

    return (
        <Grid container direction="column" spacing={24}>
            <AccountInfo 
                name={props.name} 
                number={props.number} 
                type={props.type} 
                major = {props.major}
            />
            <div className="contents_con">
                <div className="contents_title"><h6>나의 강의 목록</h6></div>
                <div className="lecture_rootbox">
                    {lecture_list.map((lect, index)=>{
                        return (<LectureBox title={lect[0]} prof={lect[1]} link="#"/>);
                    })}
                </div>
            </div>
            <BottomPopup link="#"></BottomPopup>
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

export default Home