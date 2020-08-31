import { Grid, TextField, Divider } from '@material-ui/core';
import React, { Component, useEffect } from 'react';
import { MarkdownViewer, MarkdownEditor } from '.';
import PropTypes from 'prop-types';

const Problem = (props) => {
    const [initialText, setInitialText] = React.useState("");
    const [scoreText, setScoreText] = React.useState("");

    useEffect(()=>{
        setInitialText(props.info.answerContent);
        if (props.info.assignmentState === 3)
            setScoreText(`${props.info.score}/${props.info.fullScore}점`);
        else
            setScoreText(`${props.info.fullScore}점`);
    }, [JSON.stringify(props.info)]);
    
    const handleTextChange = (value) => {
        props.onEdit(value, props.info.questionId);
    }

    return (
        <Grid container className="problem_container" direction="column">
            <Grid container className="problem_description" direction="row" alignItems="flex-start" justify="flex-start">
                <h6 className="problem_number">{props.info.questionNumber + "."}</h6>
                <MarkdownViewer className="problem_description_viewer" source={props.info.questionContent}></MarkdownViewer>
            </Grid>

            <h6 className="problem_score" align="right">{scoreText}</h6>
            <MarkdownEditor onChange={handleTextChange} contents={initialText}></MarkdownEditor>
        </Grid>
    );
}

export default Problem;