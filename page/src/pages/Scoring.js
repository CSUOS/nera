import React, { Component, useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, IconButton, Button, Typography, TextField, FormControl, Input, InputAdornment } from '@material-ui/core';
import { PageInfo, Loading } from '../components';

import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import axios from "axios";
import { useHistory } from "react-router-dom";

// const useStyles = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     margin: {
//         margin: theme.spacing(1),
//     },
//     withoutLabel: {
//         marginTop: theme.spacing(3),
//     },
//     textField: {
//         width: '25ch',
//     },
// }));

const Scoring = (props) => {
    const dateCaptionStyle = {
        width: "auto",
        display: "block",
        padding: "0 10px"
    };

    const statusCaptionStyle = {
        width: "auto",
        display: "block",
        padding: "0 10px"
    };

    const [assignInfo, setAssignInfo] = useState(undefined);
    const [answers, setAnswers] = useState(undefined);
    const [fetchDate, setFetchDate] = useState(undefined);
    const [questions, setQuestions] = useState(undefined);
    const [page, setPage] = useState(undefined);
    const history = useHistory();

    function getAssignment() {
        let assignId = props.match.params.asId;

        axios.get(`/v1/assignment/${assignId}`, { withCredentials: true })
            .then(res => {
                setAssignInfo(res.data);
            })
            .catch(err => {
                const status = err.response.status;
                if (status === 400 || status === 401) {
                    alert(`과제 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
                }
                else if (status === 404) {
                    alert("과제를 찾을 수 없습니다.");
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }
                history.push("/home");
            });
    }

    function getAnswers() {
        let assignId = props.match.params.asId;
        let userNumber = props.match.params.userNumber;

        axios.get(`/v1/answer/${assignId}/${userNumber}`, { withCredentials: true })
            .then(res => {
                setAnswers(res.data.answers);
                setPage(0);
                setFetchDate(new Date());
            })
            .catch(err => {
                const status = err.response.status;
                if (status === 400) {
                    alert(`답안 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
                }
                else if (status === 401) {
                    alert(`답안 정보를 얻는데 실패하였습니다. 인증이 실패하였습니다. (${status})`);
                }
                else if (status === 403) {
                    alert(`답안 정보를 얻는데 실패하였습니다. 권한이 없습니다. (${status})`);
                }
                else if (status === 404) {
                    // 단순히 입력한 답안이 없는 경우이므로 오류는 아님.
                    setAnswers([]);
                    setPage(0);
                    setFetchDate(new Date());
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }

                if (status !== 404) {
                    history.push("/home");
                }
            });
    }

    function getMarkedScore(qId) {
        let found = answers.filter(answer => answer.questionId == qId);
        if (found.length > 0) {
            if (found[0].score === -1)
                return 0;
            return found[0].score;
        }
        return 0;
    }

    function initQuestions() {
        if (assignInfo === undefined)
            return;

        try {
            let quesArr = [];
            let number = 1;

            for (const ques of assignInfo.questions) {
                let processed = {};
                processed.questionId = ques.questionId;
                processed.questionNumber = number++;
                processed.questionContent = ques.questionContent;
                processed.fullScore = ques.fullScore;
                processed.score = getMarkedScore(ques.questionId);
                processed.assignmentState = assignInfo.assignmentState;

                const found = answers.filter(answer => answer.questionId == ques.questionId);
                if (found.length > 0)
                    processed.answerContent = found[0].answerContent;
                else
                    processed.answerContent = "";

                quesArr.push(processed);
            }

            setQuestions(quesArr);
        } catch (err) {
            console.log(err);
        }
    }

    function initPageContent() {
        console.log(page);
    }

    useEffect(() => {
        getAssignment();
        getAnswers();
    }, [props.match.params.asId, props.match.params.userNumber]);

    useEffect(() => {
        initQuestions();
    }, [fetchDate]);

    useEffect(() => {
        initPageContent();
    }, [page]);

    const ableToGoPrev = () => {
        return page >= 1;
    }

    const ableToGoNext = () => {
        return page < questions.length-1;
    }

    const goPrev = () => {
        if (ableToGoPrev()) {
            const currentPage = page;
            setPage(currentPage-1);
        }
    }

    const goNext = () => {
        if (ableToGoNext()) {
            const currentPage = page;
            setPage(currentPage+1);
        }
    }

    if (questions === undefined)
        return (<Loading status="답안 정보를 가져오는 중..."></Loading>);
    else
        return (
            <div className="scoring_container">
                <Grid className="scoring_page_header">
                    <Grid className="scoring_page_title">
                        <PageInfo className="scoring_info"
                            icon={FormatListNumberedIcon}
                            mainTitle={`${props.match.params.userNumber}의 답안`}
                            subTitle={`${assignInfo.assignmentName}`}/>
                    </Grid>
                    <Grid className="save_container">
                        <Grid container direction="row" alignItems="flex-start" justify="flex-end">
                            <Grid container direction="column">
                                <Grid item direction="column" alignItems="flex-start" justify="flex-end">
                                    <Typography variant="caption" align="right" style={dateCaptionStyle} children={"날짜"}></Typography>
                                    <Typography variant="body2" align="right" style={statusCaptionStyle} children={"상태"}></Typography>
                                </Grid>
                                <Button className="save_component" variant="contained">저장</Button>
                                {/* <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                                <Input
                                    value={scoreText}
                                    onChange={handleScoreTextChange}
                                    endAdornment={<InputAdornment position="end">/{fullScoreText}점</InputAdornment>}>
                                </Input>
                            </FormControl> */}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* <UserAnswer number={page + 1} info={questions[page]}></UserAnswer> */}

                <div className="scoring_bottom">
                    <IconButton aria-label="이전 문제" size="medium" onClick={goPrev} disabled={!ableToGoPrev()}>
                        <ArrowBackIcon></ArrowBackIcon>
                    </IconButton>
                    <IconButton aria-label="다음 문제" size="medium" onClick={goNext} disabled={!ableToGoNext()}>
                        <ArrowForwardIcon></ArrowForwardIcon>
                    </IconButton>
                </div>
            </div>
        )
}

/*Scoring.defaultProps = {
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
}*/

export default Scoring;