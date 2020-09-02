import React, { Component, useEffect, useState } from 'react';
import { PageInfo, Loading, ScoreStats, QuestionSelector, StudentSelector } from "../components";

import AssignmentIcon from '@material-ui/icons/Assignment';
import { Box, Grid, Paper } from '@material-ui/core';
import axios from "axios";
import { useHistory } from "react-router-dom";
import { rejects } from 'assert';

const Scoring = (props) => {
    const [assign, setAssign] = useState(undefined);
    const [assignDate, setAssignDate] = useState(undefined);
    const [answersDict, setAnswersDict] = useState(undefined);
    const [answersDictDate, setAnswersDictDate] = useState(undefined);
    const [selectedQues, setSelectedQues] = useState(undefined);
    const history = useHistory();

    const getAssignment = () => {
        let assignId = props.match.params.asId;

        axios.get(`/v1/assignment/${assignId}`, { withCredentials: true })
            .then(res => {
                console.log(res);
                setAssign(res.data);
                setAssignDate(new Date());
            })
            .catch(err => {
                const status = err?.response?.status;
                if (status === undefined) {
                    alert("예기치 못한 예외가 발생하였습니다.\n"+JSON.stringify(err));
                }
                else if (status === 400 || status === 401) {
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

    const getAnswers = () => {
        if (assign === undefined)
            return;

        let assignId = props.match.params.asId;
        let promises = [];

        for (let stuNum of assign.students) {
            let prom = axios.get(`/v1/answer/${assignId}/${stuNum}`, { withCredentials: true })
                .catch(err => {
                    const status = err?.response?.status;
                    if (status === undefined) {
                        alert("예기치 못한 예외가 발생하였습니다.\n" + JSON.stringify(err));
                        history.push('/home');
                    }
                    else if (status === 404) {
                        // 단순히 입력한 답안이 없는 경우이므로 오류는 아님.
                        return {
                            "data": {
                                "userNumber": stuNum,
                                "answers": [],
                                "meta": {
                                    "createAt": undefined,
                                    "modifiedAt": undefined

                                }
                            }
                        }
                    }
                    else rejects(err);
                });

            promises.push(prom);
        }

        Promise.all(promises)
            .then(arrOfRes => {
                let dict = {}
                for (const res of arrOfRes)
                    dict[res.data.userNumber] = res.data;
                setAnswersDict(dict);
                setAnswersDictDate(new Date());
            })
            .catch(err => {
                const status = err?.response?.status;
                if (status === undefined) {
                    alert("예기치 못한 예외가 발생하였습니다.\n"+JSON.stringify(err));
                }
                else if (status === 400) {
                    alert(`답안 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
                }
                else if (status === 401) {
                    alert(`답안 정보를 얻는데 실패하였습니다. 인증이 실패하였습니다. (${status})`);
                }
                else if (status === 403) {
                    alert(`답안 정보를 얻는데 실패하였습니다. 권한이 없습니다. (${status})`);
                }
                else {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }

                history.push("/home");
            });
    }

    useEffect(() => {
        setAssign(undefined);
        setAnswersDict(undefined);
        setSelectedQues(undefined);
        getAssignment();
    }, [props.match.params.asId]);

    useEffect(() => {
        getAnswers();
    }, [assignDate]);

    function getSubTitle() {
        const deadline = new Date(assign.deadline);
        let deadlineString = deadline.getFullYear() + "-" 
                         + (deadline.getMonth()+1 <= 9 ? "0" : "") + (deadline.getMonth()+1) + "-"
                         + (deadline.getDate() <= 9 ? "0" : "") + deadline.getDate() + " "
                         + (deadline.getHours() <= 9 ? "0" : "") + deadline.getHours() + ":"
                         + (deadline.getMinutes() <= 9 ? "0" : "") + deadline.getMinutes()
        return deadlineString + " 마감";
    }

    function handleQuestionSelectorChanged(selected) {
        setSelectedQues(selected.length == 0 ? undefined : selected);
    }

    if (assign === undefined || answersDictDate === undefined)
        return <Loading status="과제 및 답안 정보를 불러오는 중..."></Loading>
    else
        return (
            <Grid container direction="column">
                <PageInfo className="assignment_info"
                    icon={AssignmentIcon}
                    mainTitle={assign.assignmentName}
                    subTitle={getSubTitle()} />

                <Grid container direction="column" className="contents_con">
                    <Grid className="contents_title"><h6>점수 통계</h6></Grid>
                    <ScoreStats className="score_stats" assign={assign} answersDict={answersDict}></ScoreStats>
                </Grid>
                <Grid container direction="column" className="contents_con">
                    <Grid className="contents_title"><h6>답안 채점하기</h6></Grid>
                    <Grid container spacing={3} direction="row" wrap="wrap" alignItems="center">
                        <Grid item xs>
                            <QuestionSelector assign={assign} onChange={handleQuestionSelectorChanged}></QuestionSelector>
                        </Grid>
                        <Grid item xs>
                            <StudentSelector assign={assign} answersDict={answersDict} selectedQues={selectedQues}></StudentSelector>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
}

export default Scoring;