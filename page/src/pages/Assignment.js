import React, { useEffect, useState } from 'react';
import { AssignmentInfo, Problem } from "../components";
import { Route } from 'react-router-dom';
import { modifiedDateToString } from '../shared/DateToString.js';

import { Button, Grid, Typography } from '@material-ui/core';
import axios from "axios";
import { useHistory } from "react-router-dom";

const Assignment = (props) => {
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

    const [info, setInfo] = useState(undefined);
    const [infoDate, setInfoDate] = useState(undefined);
    const [answers, setAnswers] = useState(undefined);
    const [answersDate, setAnswersDate] = useState(undefined);
    const [questions, setQuestions] = useState(undefined);
    const [modifiedDate, setModifiedDate] = useState(undefined);
    const [status, setStatus] = useState(undefined);
    const [statusStyle, setStatusStyle] = useState(statusCaptionStyle);
    const [modifiedAnswers, setModifiedAnswers] = useState(undefined);
    const history = useHistory();

    function getAssignment() {
        let assignId = props.match.params.asId;

        axios.get(`/v1/assignment/${assignId}`, { withCredentials: true })
            .then(res => {
                setInfo(res.data);
                setInfoDate(new Date());
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

        axios.get(`/v1/answer/${assignId}`, { withCredentials: true })
            .then(res => {
                setModifiedDate(new Date(res.data.meta.modifiedAt));
                setStatus("변경 사항 없음");
                setStatusStyle(statusCaptionStyle);
                setModifiedAnswers({});
                setAnswers(res.data.answers);
                setAnswersDate(new Date());
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
                    setModifiedDate(undefined);
                    setStatus("변경사항 없음");
                    setStatusStyle(statusCaptionStyle);
                    setModifiedAnswers({});
                    setAnswers([]);
                    setAnswersDate(new Date());
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
        if (info === undefined)
            return;

        try {
            let quesArr = [];
            let number = 1;

            for (const ques of info.questions) {
                let processed = {};
                processed.questionId = ques.questionId;
                processed.questionNumber = number++;
                processed.questionContent = ques.questionContent;
                processed.fullScore = ques.fullScore;
                processed.score = getMarkedScore(ques.questionId);
                processed.assignmentState = info.assignmentState;

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

    function handleAnswerChange(text, qId) {
        console.log(`changed in ${qId}: ${text}`);

        let currModified = modifiedAnswers;
        currModified[qId] = text;
        setModifiedAnswers(currModified);

        setStatusStyle({...statusCaptionStyle, color: "red"});
        setStatus("답안 저장 필요");
    }

    function saveAnswers() {
        let processed = {};
        for (const ques of questions)
            processed[ques.questionId] = ques.answerContent;
        for (const qId in modifiedAnswers)
            processed[qId] = modifiedAnswers[qId];

        let reqBody = {answers: []};
        for (const qId in processed) {
            reqBody.answers.push({
                questionId: qId,
                answerContent: processed[qId]
            });
        }

        setStatusStyle({...statusCaptionStyle, color: "blue"});
        setStatus("답안 저장 중...");
        let assignId = props.match.params.asId;
        axios.post(`/v1/answer/${assignId}`, reqBody, { withCredentials: true })
            .then(res => {
                setModifiedDate(new Date());
                setStatusStyle({...statusCaptionStyle});
                setStatus("변경 사항 없음");
                setModifiedAnswers({});
            })
            .catch(err => {
                const status = err.response.status;
                if (status === 400) {
                    alert(`답안을 저장하지 못했습니다. 잘못된 요청입니다. (${status})`);
                }
                else if (status === 401) {
                    alert(`답안을 저장하지 못했습니다. 인증이 실패하였습니다. (${status})`);
                }
                else if (status === 403) {
                    alert(`답안을 저장하지 못했습니다. 권한이 없습니다. (${status})`);
                }
                else if (status === 404) {
                    alert(`답안을 저장하지 못했습니다. 과제를 찾을 수 없습니다. (${status})`);
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }

                setStatusStyle({...statusCaptionStyle, color: "red"});
                setStatus("답안 저장 필요");
            });
    }

    useEffect(() => {
        setQuestions(undefined);
        getAssignment();
    }, [props.match.params.asId]);

    useEffect(() => {
        getAnswers();
    }, [infoDate]);

    useEffect(() => {
        initQuestions();
    }, [answersDate]);

    if (questions === undefined)
        return (<div></div>);
    else
        return (
            <Grid container direction="column">
                <Grid className="assignment_page_header">
                    <Grid className="assignment_page_title">
                        <AssignmentInfo title={info.assignmentName} deadline={info.deadline}></AssignmentInfo>
                    </Grid>

                    {info.assignmentState === 1 &&
                    <Grid className="save_container">
                        <Grid container direction="row" alignItems="flex-start" justify="flex-end">
                            <Grid item direction="column" alignItems="flex-start" justify="flex-end">
                                <Typography variant="caption" align="right" style={dateCaptionStyle} children={modifiedDateToString(modifiedDate)}></Typography>
                                <Typography variant="body2" align="right" style={statusStyle} children={status}></Typography>
                            </Grid>
                            <Button className="save_component" variant="contained" disabled={Object.keys(modifiedAnswers).length === 0} onClick={saveAnswers}>저장</Button>
                        </Grid>
                    </Grid>}
                </Grid>

                {info.assignmentState === 1 || info.assignmentState === 3 ? (
                    <div>
                        <Typography variant="body1" className="assignment_info" children={info.assignmentInfo}></Typography>
                        {questions.map(ques => <Problem info={ques} onEdit={handleAnswerChange} />)}
                    </div>
                ) :
                    <Typography variant="body1" className="assignment_info">과제를 확인할 수 없는 기간입니다.</Typography>
                }
            </Grid>
        );
}

export default Assignment;