import React, {useEffect, useState} from 'react';
import {AssignmentInfo, Problem} from "../components";

import { Button, Grid } from '@material-ui/core';

const Assignment = (props)=>{
    const {asInfo, asId} = props;
    const [info, setInfo] = useState();
    const [questions, setQuestions] = useState();

    console.log(asInfo);
    console.log(asId);

    const findAssignmentById = () => {
        for (let i = 0; i < asInfo.length; ++i)
        if (asInfo[i]["assignmentId"] === asId){
            console.log(asInfo[i]);
            return asInfo[i];
        }
        return undefined;
    }

    setInfo(findAssignmentById());

    useEffect(()=>{
        setQuestions(info.questions);
    },[info])

    return (
        <Grid container direction="column" spacing={24}>
            <Grid className="assignment_page_header">
                <Grid className="assignment_page_title">
                    <AssignmentInfo title={info.assignmentName} deadline={info.deadline}></AssignmentInfo>
                </Grid>
                <Grid className="save_container">
                    <Grid container direction="row" alignItems="flex-start" justify="flex-end">
                        <h6 className="save_component">변경사항 저장 안 됨</h6>
                        <Button className="save_component" variant="contained">저장</Button>
                    </Grid>
                </Grid>
            </Grid>

            {questions.map((prob, index)=>{
                return (
                    <Problem number={index+1} info={prob} marked={info.assignmentState}></Problem>
                );
            })}
        </Grid>
    );
}

export default Assignment;