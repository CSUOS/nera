import { Grid, Typography, Paper } from '@material-ui/core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const UserAnswer = (props) => {
    return (
        <Grid container className="problem_container" direction="column">
            <Grid container className="problem_description" direction="row" alignItems="flex-start" justify="flex-start">
                <h6 className="problem_number">{props.number + "."}</h6>
                <h6 align="left">{props.info["question_content"]}</h6>
            </Grid>

            {props.image ? <img className="problem_image" src={props.image} alt="Problem Image" /> : null}

            <Paper className="answer_content">
                <Typography variant="body1">{props.info.question_answer[0].answer_content[0]}</Typography>
            </Paper>
        </Grid>
    );
}

UserAnswer.propTypes = {
    info: PropTypes.shape({
        "question_id": PropTypes.number,
        "question_content": PropTypes.string,
        "full_score": PropTypes.number,
        "question_answer": PropTypes.arrayOf(PropTypes.shape({
            "user_number": PropTypes.number,
            "question_id": PropTypes.number,
            "name": PropTypes.string,
            "answer_content": PropTypes.arrayOf(PropTypes.string),
            "submitted": PropTypes.bool,
            "score": PropTypes.number,
            "meta": {
                "create_at": PropTypes.instanceOf(Date),
                "modified_at": PropTypes.instanceOf(Date)
            }
        })),
        "meta": {
            "create_at": PropTypes.instanceOf(Date),
            "modified_at": PropTypes.instanceOf(Date)
        }
    })
}

export default UserAnswer;