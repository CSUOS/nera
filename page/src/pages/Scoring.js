import React, { Component, useEffect, useState } from 'react';
import { PageInfo, Loading, ScoreStats, QuestionSelector, StudentSelector, MarkdownViewer, UserAnswer } from "../components";
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Box, Grid, Paper, Divider, Typography } from '@material-ui/core';
import axios from "axios";
import { useHistory } from "react-router-dom";
import { rejects } from 'assert';

const Scoring = (props) => {
    const [assign, setAssign] = useState(undefined);
    const [assignDate, setAssignDate] = useState(undefined);
    const [answersDict, setAnswersDict] = useState(undefined);
    const [answersDictDate, setAnswersDictDate] = useState(undefined);
    const [selectedQues, setSelectedQues] = useState([]);
    const [selectedStus, setSelectedStus] = useState([]);
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
                else if (status === 400) {
                    alert(`과제 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
                }
                else if (status === 401) {
                    history.push("/");
                }
                else if (status === 404) {
                    alert("과제를 찾을 수 없습니다.");
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }
                console.log(err);
                //history.push("/home");
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
                        console.log(err);
                        //history.push('/home');
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

                console.log(err);
                //history.push("/home");
            });
    }

    useEffect(() => {
        setAssign(undefined);
        setAnswersDict(undefined);
        setSelectedQues([]);
        setSelectedStus([]);
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
        if (selected.length)
            setSelectedQues(selected);
    }

    function handleStudentSelectorChanged(selected) {
        if (selected.length)
            setSelectedStus(selected);
    }

    function arrayToString(arr, unit) {
        if (arr.length <= 3)
            return arr.join(", ");
        else
            return `${arr.slice(0, 1).join(", ")}를 포함한 ${arr.length}${unit}`;
    }

    function handleScoreChange(quesId, userNum, score) {
        console.log(`${quesId}의 점수를 ${score}로 바꿉니다.`);

        let reqBody = {answers: []};
        for (let ans of answersDict[userNum].answers) {
            if (ans.questionId === quesId) {
                reqBody.answers.push({
                    questionId: quesId,
                    score: score
                });
            } else {
                reqBody.answers.push({
                    questionId: ans.questionId,
                    score: ans.score
                });
            }
        }

        axios.post(`/v1/answer/${assign.assignmentId}/${userNum}`, reqBody, { withCredentials: true })
            .then(res => {
                let newAnsDict = JSON.parse(JSON.stringify(answersDict));
                newAnsDict[userNum].answers.find(ans => ans.questionId === quesId).score = score;
                console.log(newAnsDict)
                setAnswersDict(newAnsDict);
            })
            .catch(err => {
                const status = err?.response?.status;
                if (status === undefined) {
                    alert("예기치 못한 예외가 발생하였습니다.\n" + JSON.stringify(err));
                }
                else if (status === 400) {
                    alert(`점수를 저장하지 못했습니다. 잘못된 요청입니다. (${status})`);
                }
                else if (status === 401) {
                    alert(`점수를 저장하지 못했습니다. 인증이 실패하였습니다. (${status})`);
                }
                else if (status === 403) {
                    alert(`점수를 저장하지 못했습니다. 권한이 없습니다. (${status})`);
                }
                else if (status === 404) {
                    alert(`점수를 저장하지 못했습니다. 과제를 찾을 수 없습니다. (${status})`);
                }
                else if (status === 500) {
                    alert(`내부 서버 오류입니다. 잠시 후에 다시 시도해주세요... (${status})`);
                }
            });
    }

    function getQueryResult(ques, stus) {
        try {
            let coms = [];
            if (ques === undefined || stus === undefined ||
                ques.length === 0 || stus.length === 0) {
                coms.push(<Typography variant="h6" className="query_caption">답안을 조회할 문제 목록과 학생 목록을 선택해주세요!</Typography>);
            } else {
                ques.sort();
                stus.sort();
                coms.push(<Typography variant="h6" className="query_caption">{`${arrayToString(stus, '명')}의 학생이 작성한 답안 중, ${arrayToString(ques, '개')} 문제의 답안을 조회합니다.`}</Typography>);

                let quesSet = new Set(ques);
                let questionNumber = 1;
                for (let q of assign.questions) {
                    if (quesSet.has(q.questionId)) {
                        let ansComs = [];
                        for (const stuNumber of stus) {
                            let answer = answersDict[stuNumber]?.answers?.find(item => item.questionId === q.questionId);

                            if (answer)
                                ansComs.push(
                                    <UserAnswer
                                        score={answer.score}
                                        fullScore={q.fullScore}
                                        answerContent={answer.answerContent}
                                        userNumber={stuNumber}
                                        questionNumber={questionNumber}
                                        questionId={q.questionId}
                                        onChange={handleScoreChange}
                                    />
                                );
                            else
                                ansComs.push(
                                    <UserAnswer
                                        score={-1}
                                        fullScore={q.fullScore}
                                        answerContent={undefined}
                                        userNumber={stuNumber}
                                        questionNumber={questionNumber}
                                        questionId={q.questionId}
                                    />
                                );
                        }

                        coms.push(
                            <Grid container className="problem_container" direction="column">
                                <Grid container className="problem_description" direction="row" alignItems="flex-start" justify="flex-start">
                                    <h6 className="problem_number">{questionNumber + "."}</h6>
                                    <MarkdownViewer className="problem_description_viewer" source={q.questionContent}></MarkdownViewer>
                                </Grid>
                                {ansComs}
                            </Grid>
                        );
                    }
                    ++questionNumber;
                }
            }
            return coms;
        } catch (err) {
            console.log(err);
            return <Typography variant="h6" className="query_caption">문제를 조회하는 동안 오류가 발생하였습니다.</Typography>
        }
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
                            <StudentSelector assign={assign} answersDict={answersDict} selectedQues={selectedQues} onChange={handleStudentSelectorChanged}></StudentSelector>
                        </Grid>
                    </Grid>
                    <Divider></Divider>
                    {getQueryResult(selectedQues, selectedStus)}
                </Grid>
            </Grid>
        );
}

export default Scoring;