import React, {useEffect, useState} from 'react';
import {AssignmentInfo, Problem} from "../components";
import { Route } from 'react-router-dom';

import { Button, Grid } from '@material-ui/core';
import axios from "axios";
import { useHistory } from "react-router-dom";

const Assignment = (props)=>{
    const [info, setInfo] = useState(undefined);
    const [questions, setQuestions] = useState(undefined);
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

    function getQuestions() {
        let assignId = props.match.params.as_id;
        
        axios.get(`/v1/answer/${assignId}`, { withCredentials: true })
            .then(res => {
                let quesArr = [];
                let number = 1;
                // 백앤드 코드에서 과제 요청에 대한 응답으로
                // questionId를 반환하지 않는 것으로 확인됨.
                // 그 문제가 해결된 이후에 quesArr를 알맞게
                // 설정하는 코드를 작성할 것.
                /*for (let ques of res.data.answers) {
                    let processed = {};
                    processed.answerContent = ques.answerContent;
                    processed.questionNumber = number++;
                    processed.questionId = ques.questionId;
                    processed.fullScore = 1;
                    quesArr.push(processed);
                }*/
                setQuestions(quesArr);
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
                    // 백앤드 코드에서 과제 요청에 대한 응답으로
                    // questionId를 반환하지 않는 것으로 확인됨.
                    // 그 문제가 해결된 이후에 quesArr를 알맞게
                    // 설정하는 코드를 작성할 것.
                    return;
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }
                history.push("/home");
            })
    }

    async function fetchData() {
        await getAssignment();
        await getQuestions();
    }

    useEffect(()=>{
        fetchData();
    }, [props.match.params.as_id])

    if (info === undefined)
        return (<div></div>);
    else
        return (
            <Grid container direction="column" spacing={24}>
                <Grid className="assignment_page_header">
                    <Grid className="assignment_page_title">
                        <AssignmentInfo title={info.assignmentName} deadline={info.deadline}></AssignmentInfo>
                    </Grid>
                    <Grid className="save_container">
                        <Grid container direction="row" alignItems="flex-start" justify="flex-end">
                            <h6 className="save_component">변경사항 저장 안 됨</h6>
                            <Button className="save_component" variant="contained">저장</Button>
                        </Grid>
                    </Grid>
                </Grid>


            </Grid>
        );
}

export default Assignment;