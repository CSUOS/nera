import React, {useEffect, useState} from 'react';
import {AssignmentInfo, Problem} from "../components";
import { Route } from 'react-router-dom';

import { Button, Grid } from '@material-ui/core';
import axios from "axios";
import { useHistory } from "react-router-dom";

const Assignment = (props)=>{
    const [info, setInfo] = useState(undefined);
    const history = useHistory();

    useEffect(()=>{
        let assignId = props.match.params.as_id;
        console.log(assignId);
        axios.get(`/v1/assignment/${assignId}`, { withCredentials: true })
            .then(res => {
                setInfo(res.data);
            })
            .catch(err => {
                console.log(err);
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