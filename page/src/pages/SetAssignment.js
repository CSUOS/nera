import React, {useState, useEffect} from 'react';
import { Grid, Paper, TextField, Typography, Button } from '@material-ui/core';
import {PageInfo, TimePicker} from '../components';
import { useHistory } from "react-router-dom";
import axios from "axios";

import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Modal from '@material-ui/core/Modal';

  

function SetAssignment(props){
    const [open, setOpen] = useState(false);
    const [assignInfo, setAssignInfo] = useState("");
    const [lectureName, setLecture] = useState("");
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [questions, setQuestions] = useState([]);
    const [students, setStudents] = useState([]);

    const [qInfo, setQInfo] = useState({});
    const history = useHistory();

    const handleOpen = () => {
        setOpen(true);
    };
  
    const handleClose = () => {
        setOpen(false);
        setQInfo([]);
    };

    function getData(){
        const asId = props.match.params.asId;
        if(asId!==undefined && asId!=="add"){ // 이미 존재하는 과제 설정을 수정하는 페이지
            // api로 받아오기
            axios
            .get(`/v1/assignment/${asId}`, { withCredentials: true })
            .then(res => {
                const data = res.data;
                setAssignInfo(data.assignmentInfo);
                let tmp = data.assignmentName.split('[');
                tmp = tmp[1].split(']');
                setLecture(tmp[0]);
                setTitle(tmp[1]);
                setStartDate(Date(data.publishingTime)); // 시작 날짜 받기 => 나중에 문서 추가되면 실제로 as_info에서 받기
                setEndDate(Date(data.deadline)); // 마감 날짜 받기
                setQuestions(data.questions);
                setStudents(data.students);
            })
            .catch(err=>{
                const status = err.response.status;
                if (status === 400) {
                    alert(`과제 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
                }
                else if (status === 401) {
                    alert(`과제 정보를 얻는데 실패하였습니다. 인증이 실패하였습니다. (${status})`);
                }
                else if (status === 404) {
                    alert(`과제 정보를 얻는데 실패하였습니다. 과제를 찾을 수 없습니다. (${status})`);
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }
                //history.push("/home");
            });
        }
    }


    useEffect(()=>{
        async function fetchData() {
            await getData();
        }

        fetchData();
    }, [props.match.params.asId]);

    function setQuestionInfo(questionId){
        if(questionId!=-1){
            for(let i=0; i<questions.length; i++){
                if(questions[i].questionId===questionId){
                    setQInfo(questions[i]);
                    break;
                }
            }
        }
    }

    function AddQuestion(){
        // api로 수정 or 저장하기
    }

    async function openPopUp(questionId){
        await setQuestionInfo(questionId);
        await handleOpen();
    }

    async function closePopUp(questionId){
        // api
        await handleClose();
    }

    function PrintModal(){
        return(
            <Paper className="modal_con">
                <form className="modal_form">
                    <TextField label="문제 내용" required multiline rows={1} rowsMax={10000} className="modal_input_field" defaultValue={qInfo["questionContent"]}></TextField>
                    <TextField label="배점" required rows={1} rowsMax={10000} className="modal_input_field" defaultValue={qInfo["fullScore"]}></TextField>
                    <Button className="save_button" onClick={()=>closePopUp(qInfo["questionId"])}>저장</Button>
                </form>
            </Paper>
        );
    }

    return(
        <Grid container direction="column">
            <PageInfo className="assignment_info"
                icon={SettingsIcon}
                mainTitle="과제별 설정"
                subTitle="" />
            <form className="setting_as_form">
                <Grid direction="column" className="setting_as_con">
                    <Grid container direction="row">
                        <Grid xs={6}><TextField InputLabelProps={{shrink:true}} label="강의명" required multiline rows={1} rowsMax={10000} defaultValue={lectureName}></TextField></Grid>
                        <Grid xs={6}><TextField InputLabelProps={{shrink:true}} label="과제명" required multiline rows={1} rowsMax={10000} defaultValue={title}></TextField></Grid>
                    </Grid>
                    <TimePicker
                        startDate = {startDate}
                        endDate = {endDate}
                    />
                    <Grid container direction="row">
                        <Grid xs={6}><TextField InputLabelProps={{shrink:true}} label="과제설명" required multiline rows={1} rowsMax={10000} defaultValue={assignInfo}></TextField></Grid>
                    </Grid>
                    
                    <Grid container direction="column">
                        {
                            questions.map((q)=>
                                <Grid className="admin_question_con">
                                    <Paper onClick={()=>openPopUp(q.questionId)}>
                                        <Grid><Typography variant="h6">{q.questionContent}</Typography></Grid>
                                    </Paper>
                                </Grid>
                            )
                        }
                        <Grid>
                            <AddCircleIcon fontSize="large" onClick={handleOpen}/>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="add question to assignment"
                                aria-describedby="add question to assignment"
                                className="modal">
                                { PrintModal() }
                            </Modal>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    );
}

export default SetAssignment;