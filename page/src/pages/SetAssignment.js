import React, {useState} from 'react';
import { Grid, Paper, TextField, Typography, Button } from '@material-ui/core';
import {PageInfo, TimePicker} from '../components';
import clsx from 'clsx';

import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Modal from '@material-ui/core/Modal';

  

function SetAssignment(props){
    const [q_info, setQInfo] = useState({"content":"","full_score":0});
    const {as_info} = props;

        // data 정리

    let lecture_name = "";
    let title="";
    let start_date = Date.now();
    let end_date = Date.now();
    let score = "";
    let info = "";
    let questions = [];

    if(as_info!=undefined){
        let tmp = as_info.assignment_name.split('[');
        tmp = tmp[1].split(']');
        lecture_name = tmp[0];
        title=tmp[1];
        start_date = Date.now();
        end_date = as_info.deadline;
        score = as_info.score;
        info = as_info.assignment_info;
        questions = as_info.questions;
    }

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setQInfo([]);
    };

    const setQuestionInfo = (q_id)=>{
        if(q_id!=-1){
            console.log(q_id);
            for(let i=0; i<questions.length; i++){
                if(questions[i].question_id===q_id){
                    let tmp = [];
                    tmp["content"] = questions[i].question_content;
                    tmp["full_score"] = questions[i].full_score;
                    setQInfo(tmp);
                }
            }
        }
    }

    function printQuestion(){
        // question_content를 간단히 나타내기
        return(
            questions.map((q)=>
                <Grid className="admin_question_con">
                    <Paper onClick={event => {handleOpen(); setQuestionInfo(q.question_id);}}>
                        <Grid><Typography variant="h6">{q.question_content}</Typography></Grid>
                    </Paper>
                </Grid>
            )
        );
    }

    function AddQuestion(){
        // api로 수정 or 저장하기
    }

    function PrintModal(){
        return(
            <Paper className="modal_con">
                <form className="modal_form">
                    <TextField label="문제 내용" required multiline rows={1} rowsMax={10000} className="modal_input_field" defaultValue={q_info["content"]}></TextField>
                    <TextField label="배점" required rows={1} rowsMax={10000} className="modal_input_field" defaultValue={q_info["full_score"]}></TextField>
                    <Button onClick={AddQuestion}>저장</Button>
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
                        <Grid xs={6}><TextField label="강의명" required rows={1} rowsMax={10000} defaultValue={lecture_name}></TextField></Grid>
                        <Grid xs={6}><TextField label="과제명" required rows={1} rowsMax={10000} defaultValue={title}></TextField></Grid>
                    </Grid>
                    <TimePicker
                        start_date = {start_date}
                        end_date = {end_date}
                    />
                    <Grid container direction="row">
                        <Grid xs={6}><TextField label="배점" required rows={1} rowsMax={10000} defaultValue={score}></TextField></Grid>
                        <Grid xs={6}><TextField label="과제설명" required multiline rows={1} rowsMax={10000} defaultValue={info}></TextField></Grid>
                    </Grid>
                    
                    <Grid container direction="column">
                        {
                            printQuestion()
                        }
                        <Grid>
                            <AddCircleIcon fontSize="large" onClick={handleOpen}/>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="add question to assignment"
                                aria-describedby="add question to assignment"
                                className="modal">
                                {PrintModal()}
                            </Modal>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    );
}

export default SetAssignment;