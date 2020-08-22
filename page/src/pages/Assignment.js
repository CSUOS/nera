import React, { useEffect, useState } from 'react';
import { AssignmentInfo, Problem } from "../components";
import { Route } from 'react-router-dom';

import { Button, Grid, Typography } from '@material-ui/core';
import axios from "axios";
import { useHistory } from "react-router-dom";

const Assignment = (props) => {
    const [info, setInfo] = useState(undefined);
    const [answers, setAnswers] = useState(undefined);
    const [questions, setQuestions] = useState(undefined);
    const [modifiedDate, setModifiedDate] = useState(undefined);
    const [status, setStatus] = useState(undefined);
    const history = useHistory();

    function getAssignment() {
        let assignId = props.match.params.as_id;

        axios.get(`/v1/assignment/${assignId}`, { withCredentials: true })
            .then(res => {
                setInfo(res.data);
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
        let assignId = props.match.params.as_id;

        axios.get(`/v1/answer/${assignId}`, { withCredentials: true })
            .then(res => {
                setAnswers(res.data.answers);
                setModifiedDate(new Date(res.data.meta.modifiedAt));
                setStatus("변경사항 없음");
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
                    setModifiedDate(undefined);
                    setStatus("변경사항 없음");
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }

                if (status !== 404) {
                    history.push("/home");
                }
            });
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
        setStatus("답안 저장 필요");
    }

    function modifiedDateToString(date) {
        if (date === undefined)
            return "저장 기록 없음";

        let dateStr = date.getFullYear() + "-" 
                    + (date.getMonth()+1 <= 9 ? "0" : "") + (date.getMonth()+1) + "-"
                    + (date.getDate() <= 9 ? "0" : "") + date.getDate() + " "
                    + (date.getHours() <= 9 ? "0" : "") + date.getHours() + ":"
                    + (date.getMinutes() <= 9 ? "0" : "") + date.getMinutes();
        return dateStr + "에 저장함";
    }

    useEffect(() => {
        setQuestions(undefined);
        getAssignment();
    }, [props.match.params.as_id]);

    useEffect(() => {
        getAnswers();
    }, [JSON.stringify(info)]);

    useEffect(() => {
        initQuestions();
    }, [JSON.stringify(answers)]);

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
                                <Typography variant="caption" align="right" className="save_caption" children={modifiedDateToString(modifiedDate)}></Typography>
                                <Typography variant="body2" align="right" className="save_caption" children={status}></Typography>
                            </Grid>
                            <Button className="save_component" variant="contained">저장</Button>
                        </Grid>
                    </Grid>}
                </Grid>

                <Typography variant="body1" className="assignment_info" children={info.assignmentInfo}></Typography>


                {questions.map(ques => <Problem info={ques} onEdit={handleAnswerChange} />)}
            </Grid>
        );
}

export default Assignment;