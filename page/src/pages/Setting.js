import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@material-ui/core';
import {PageInfo} from '../components';
import { getUserInfo } from "../shared/GetUserInfo";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import SettingsIcon from '@material-ui/icons/Settings';
import { Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { green } from '@material-ui/core/colors';

// css 수정해야함

function Setting(){
    const [assignmentList, setAList] = useState([]);
    const [assignmentBox, setABox] = useState(<div></div>);
    const history = useHistory();
    
    function setAssignmentList(){
        axios.get('/v1/assignment', { withCredentials: true })
        .then(res => {
            let assign = res.data;
            let list = [];
            for (let i = 0; i < assign.length; i++) {
            // id: 0, title : 1, state : 2
            list.push(
                {
                    assignmentId: assign[i].assignmentId,
                    assignmentName : assign[i].assignmentName,
                    assignmentState : assign[i].assignmentState
                });
            }
            setAList(list);
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
            history.push("/");
        });
    }

    function getAssignmentBox(as){
        let stateWord = "error";

        switch(as.assignmentState){
            case 0: stateWord="마감 전"; break;
            case 1: stateWord="채점 전"; break;
            case 2: stateWord="채점 완료"; break;
            default: return;
        }

        let icon = <FiberManualRecordIcon/>
        switch(as.assignmentState){
            case 0:
                icon = <FiberManualRecordIcon style={{color:green[700]}}/>;
                break;
            case 1:
                icon = <FiberManualRecordIcon color="secondary"/>;
                break;
            default :
                icon = <FiberManualRecordIcon/>;
        }
        return(
            <Link to={"/home/setting/"+as.assignmentId} className="s_assignment_box">
                <Paper>
                    <Grid container>
                    {icon}
                    <Typography>
                        {as.assignmentName} ({stateWord})
                    </Typography>
                    </Grid>
                </Paper>
            </Link>
        );
    }

    useEffect(() => {
        async function setAssignment(){
            await setAssignmentList();
        }

        setAssignment();
    }, []);

    return(
        <Grid container direction="column">
            <PageInfo className="assignment_info"
                icon={SettingsIcon}
                mainTitle="과제관리"
                subTitle="" />
            <Grid>
                <Grid className="s_assignment_rootbox">
                    {
                        assignmentList.map((as)=> getAssignmentBox(as))
                    }
                    <Grid>
                        <Link to="/home/setting/add">
                            <AddCircleIcon fontSize="large"/>
                        </Link>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Setting;