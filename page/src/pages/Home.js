import React from 'react';
<<<<<<< HEAD
import {Link} from 'react-router-dom';
=======
>>>>>>> ec01272ffae0f2462a430492bb0c2c56255485a0
import {AccountInfo, BottomPopup, AssignmentBox} from "../components";

import { Grid } from '@material-ui/core';

const Home = (props)=>{
<<<<<<< HEAD
=======
    /*const lecture= props.lecture;

    //lecture_box data
    let lecture_list=[];
    let i=0;
    for(let lect of lecture){
        const title = lect[0]+" ("+lect[1]+")";
        const professor = lect[2] + " 교수님";
        lecture_list[i++] = [title,professor];
        
    }*/
>>>>>>> ec01272ffae0f2462a430492bb0c2c56255485a0

    return (
        <Grid container direction="column" spacing={24}>
            <AccountInfo 
                name={props.name} 
                number={props.number} 
                type={props.type} 
                major = {props.major}
            />
            <BottomPopup link="#"></BottomPopup>
            <Grid container direction="column" className="contents_con">    
                <div className="contents_title"><h6>제출 가능한 과제</h6></div>
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

export default Home