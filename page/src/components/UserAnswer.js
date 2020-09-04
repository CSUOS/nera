import { Grid, Typography, Paper, Divider, FormControl, MenuItem, InputLabel, Select, FormControlLabel, Box } from '@material-ui/core';
import React, { Component, useEffect } from 'react';
import { MarkdownViewer } from '.';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const UserAnswer = (props) => {
    const [open, setOpen] = React.useState(false);
    const [score, setScore] = React.useState(undefined);
    const [scoreItems, setScoreItems] = React.useState(undefined);

    useEffect(() => {
        setScore(props.score);
        let items = [<MenuItem value={-1}>{"채점 안 됨"}</MenuItem>];

        if (props.answerContent !== undefined) {
            for (let s = 0; s <= props.fullScore; ++s) {
                items.push(<MenuItem value={s}>{`${s}점`}</MenuItem>);
            }
        }
        setScoreItems(items);
    }, [props]);

    function handleClose() {
        setOpen(false);
    }

    function handleOpen() {
        setOpen(true);
    }

    function handleChange(event) {
        setScore(event.target.value);
        if (props.onChange)
            props.onChange(props.questionId, props.userNumber, event.target.value);
    }

    if (scoreItems === undefined)
        return <div></div>;
    else
        return (
            <Paper className="answer_content">
                <Grid direction="column">
                    <Typography gutterBottom variant="subtitle1">{`${props.userNumber}의 ${props.questionNumber}번 문제 답안`}</Typography>
                    <Divider orientation="horizontal"></Divider>
                    <MarkdownViewer source={props.answerContent ? props.answerContent : "*제출한 답안 없음*"}></MarkdownViewer>
                    <Divider orientation="horizontal"></Divider>
                    <Grid container direction="row" justify="center" alignItems="center" className="score_control">
                        <Typography className="answer_score">점수</Typography>
                        <Select className="answer_select" value={score} open={open} onClose={handleClose} onOpen={handleOpen} onChange={handleChange}>
                            {scoreItems}
                        </Select>
                    </Grid>
                </Grid>
            </Paper>
        );
}

export default UserAnswer;