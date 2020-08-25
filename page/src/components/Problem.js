import { Grid, TextField } from '@material-ui/core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Problem = (props) => {
    const [text, setText] = React.useState(props.info.question_answer[0].answer_content[0]);
    
    const handleTextChange = (event) => {
        setText(event.target.value);
    }

    return (
        <Grid container className="problem_container" direction="column">
            <Grid container className="problem_description" direction="row" alignItems="flex-start" justify="flex-start">
                <h6 className="problem_number">{props.number + "."}</h6>
                <h6 align="left">{props.info["question_content"]}</h6>
            </Grid>

            <h6 className="problem_score" align="right">{props.info["full_score"] + "점"}</h6>
            {props.image ? <img className="problem_image" src={props.image} alt="Problem Image" /> : null}

            <TextField
                label="답안"
                margin="normal"
                required multiline
                rows={1}
                rowsMax={10000}
                value={text}
                onChange={handleTextChange}>
            </TextField>
        </Grid>
    );
}

Problem.propTypes = {
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

export default Problem;