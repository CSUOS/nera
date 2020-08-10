import React, { Component } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, IconButton, Button, TextField, FormControl, Input, InputAdornment } from '@material-ui/core';
import { ScoringInfo, UserAnswer } from '../components';
import PropTypes from 'prop-types';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '25ch',
    },
}));

const Scoring = (props) => {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [scoreText, setScoreText] = React.useState(props.info.questions[page].question_answer[0].score);
    const [fullScoreText, setFullScoreText] = React.useState(props.info.questions[page].full_score);

    const ableToGoPrev = () => {
        return page >= 1;
    }

    const ableToGoNext = () => {
        return page < props.info.questions.length-1;
    }

    const goPrev = () => {
        if (ableToGoPrev()) {
            const currentPage = page;
            setPage(currentPage-1);
            setScoreText(props.info.questions[currentPage-1].question_answer[0].score);
            setFullScoreText(props.info.questions[currentPage-1].full_score);
        }
    }

    const goNext = () => {
        if (ableToGoNext()) {
            const currentPage = page;
            setPage(currentPage+1);
            setScoreText(props.info.questions[currentPage+1].question_answer[0].score);
            setFullScoreText(props.info.questions[currentPage+1].full_score);
        }
    }

    const handleScoreTextChange = (event) => {
        setScoreText(event.target.value);
    }

    return (
        <div className="scoring_container">
            <Grid className="scoring_page_header">
                <Grid className="scoring_page_title">
                    <ScoringInfo userNumber={props.number} asName={props.info.assignment_name}></ScoringInfo>
                </Grid>
                <Grid className="save_container">
                    <Grid container direction="row" alignItems="flex-start" justify="flex-end">
                        {/* <TextField className="score_field" 
                            inputProps={{ style: {textAlign: 'center'} }} 
                            value={`${props.info.questions[page].question_answer[0].score}`}></TextField>
                        <h5 className="score_text">{`/ ${props.info.questions[page].full_score}`}</h5>
                        <Button className="save_component" variant="contained">저장</Button> */}

                        <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                            <Input
                                value={scoreText}
                                onChange={handleScoreTextChange}
                                endAdornment={<InputAdornment position="end">/{fullScoreText}점</InputAdornment>}>
                            </Input>
                        </FormControl>

                    </Grid>
                </Grid>
            </Grid>

            <UserAnswer number={page + 1} info={props.info.questions[page]}></UserAnswer>
            
            <div className="scoring_bottom">
                <IconButton aria-label="이전 문제" size="medium" onClick={goPrev} disabled={page < 1}>
                    <ArrowBackIcon></ArrowBackIcon>
                </IconButton>
                <IconButton aria-label="다음 문제" size="medium" onClick={goNext} disabled={page >= props.info.questions.length-1}>
                    <ArrowForwardIcon></ArrowForwardIcon>
                </IconButton>
            </div>
        </div>
    )
}

Scoring.defaultProps = {
    info: PropTypes.shape({
        "assignment_id": PropTypes.number,
        "assignment_name": PropTypes.string,
        "deadline": PropTypes.instanceOf(Date),
        "assignment_state": PropTypes.number,
        "assignment_info": PropTypes.string,
        "full_score": PropTypes.number,
        "score": PropTypes.number,
        "students": PropTypes.arrayOf(PropTypes.number),
        "questions": PropTypes.arrayOf(PropTypes.shape({
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
        })),
        "meta": {
            "create_at": PropTypes.instanceOf(Date),
            "modified_at": PropTypes.instanceOf(Date)
        }
    })
}

export default Scoring;