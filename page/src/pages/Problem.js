import React from 'react';
import {LectureInfo} from "../components";

import { Grid } from '@material-ui/core';

const Problem = (props)=>{
    const title = "Assignment #"+props.number;
    return (
        <Grid container direction="column" spacing={24}>
            <LectureInfo title={title} prof="100/100점"/>
            
        </Grid>
    )
}

export default Problem