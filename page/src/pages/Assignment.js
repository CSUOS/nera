import React from 'react';
import {AssignmentInfo, PartBox} from "../components";

import { Grid } from '@material-ui/core';

const Assignment = (props)=>{

    return (
        <Grid container direction="column" spacing={24}>
            <AssignmentInfo title={props.title} deadline={props.deadline}/>
            <Grid container direction="column" className="contents_con">
                <div className="contents_title"><h6>과제의 세부 Part 목록</h6></div>
                <Grid container direction="row" className="assignment_rootbox">
                    <PartBox title="Part 1: 문제 풀이" link={"/assignment/" + props.assignment_id + "/1"}/>
                    <PartBox title="Part 2: 질의 응답" link={"/assignment/" + props.assignment_id + "/2"}/>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Assignment