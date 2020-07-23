import React from 'react';
import {AccountInfo, BottomPopup, AssignmentBox} from "../components";

import { Grid } from '@material-ui/core';

const Home = (props)=>{
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