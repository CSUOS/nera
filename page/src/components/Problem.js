import { Grid, TextField } from '@material-ui/core';
import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';

const Problem = (props) => {
    const [text, setText] = React.useState("");

    useEffect(()=>{
        setText(props.info.answerContent);
    }, [JSON.stringify(props.info)]);
    
    const handleTextChange = (event) => {
        setText(event.target.value);
        props.onEdit(event.target.value, props.info.questionId);
    }

    return (
        <Grid container className="problem_container" direction="column">
            <Grid container className="problem_description" direction="row" alignItems="flex-start" justify="flex-start">
                <h6 className="problem_number">{props.info.questionNumber + "."}</h6>
                <h6 align="left">{props.info.questionContent}</h6>
            </Grid>

            <h6 className="problem_score" align="right">{props.info.fullScore + "점"}</h6>
            {/*props.image ? <img className="problem_image" src={props.image} alt="Problem Image" /> : null*/}

            <TextField
                label="답안"
                margin="normal"
                multiline
                rows={1}
                rowsMax={10000}
                value={text}
                onChange={handleTextChange}
                disabled={props.info.assignmentState !== 1}>
            </TextField>
        </Grid>
    );
}

export default Problem;