import { Grid, Typography, Paper, Divider } from '@material-ui/core';
import React, { Component } from 'react';
import { MarkdownViewer } from '.';
import PropTypes from 'prop-types';

const UserAnswer = (props) => {
    console.log(props);
    return (
        <Grid container className="problem_container" direction="column">
            <Grid container className="problem_description" direction="row" alignItems="flex-start" justify="flex-start">
                <h6 className="problem_number">{props.info.questionNumber + "."}</h6>
                <MarkdownViewer className="problem_description_viewer" source={props.info.questionContent}></MarkdownViewer>
            </Grid>

            <Paper className="answer_content">
                <Grid direction="column">
                    <Typography variant="caption">미리 보기</Typography>
                    <Divider className="answer_caption_divider" orientation="horizontal"></Divider>
                    <MarkdownViewer source={props.info.answerContent}></MarkdownViewer>
                </Grid>
            </Paper>
        </Grid>
    );
}

// UserAnswer.propTypes = {
//     info: PropTypes.shape({
//         "question_id": PropTypes.number,
//         "question_content": PropTypes.string,
//         "full_score": PropTypes.number,
//         "question_answer": PropTypes.arrayOf(PropTypes.shape({
//             "user_number": PropTypes.number,
//             "question_id": PropTypes.number,
//             "name": PropTypes.string,
//             "answer_content": PropTypes.arrayOf(PropTypes.string),
//             "submitted": PropTypes.bool,
//             "score": PropTypes.number,
//             "meta": {
//                 "create_at": PropTypes.instanceOf(Date),
//                 "modified_at": PropTypes.instanceOf(Date)
//             }
//         })),
//         "meta": {
//             "create_at": PropTypes.instanceOf(Date),
//             "modified_at": PropTypes.instanceOf(Date)
//         }
//     })
// }

export default UserAnswer;