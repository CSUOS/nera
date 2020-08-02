import React from 'react';
import { Grid, Paper, TextField, Typography, Button } from '@material-ui/core';
import {PageInfo, TimePicker} from '../components';

import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input_field: {
        margin: '10px',
    },
    paper:{
        padding: '16px',
    }
  }));
  

function SetAssignment(props){
    const classes = useStyles();
    const {as_info} = props;

        // data 정리

    let lecture_name = "";
    let title="";
    let start_date = Date.now();
    let end_date = Date.now();
    let score = "";
    let info = "";

    if(as_info!=undefined){
        let tmp = as_info.assignment_name.split('[');
        tmp = tmp[1].split(']');
        lecture_name = tmp[0];
        title=tmp[1];
        start_date = Date.now();
        end_date = as_info.deadline;
        score = as_info.score;
        info = as_info.assignment_info;
    }

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    let questions = [];

    if(as_info!=undefined){
        questions = as_info.questions;
    }

    function printQuestion(){
        // question_content를 간단히 나타내기
        return(
            questions.map((q)=>
                <Grid>
                    <Paper>
                        <Grid><Typography variant="h6"></Typography></Grid>
                    </Paper>
                </Grid>
            )
        );
    }

    function AddQuestion(){
        // 해야함
        const tmp = {  
            "question_id" : 0,
            "question_content" : "SHA에 대해 조사하세요.",
            "full_score" : 60,
            "question_answer":[],
            "meta": {
                "create_at": new Date('2020-08-01T11:59:00'),
                "modified_at": new Date('2020-08-01T11:59:00'),
            }
        }
        questions.push(tmp);
    }

    function PrintModal(){
        return(
            <Paper className={classes.paper}>
                <form>
                    <TextField label="문제 제목" required rows={1} rowsMax={10000} className={classes.input_field}></TextField>
                    <TextField label="문제 내용" multiline rows={1} rowsMax={10000} className={classes.input_field}></TextField>
                    <TextField label="문제 설명" multiline rows={1} rowsMax={10000} className={classes.input_field}></TextField>
                    <TextField label="배점" required rows={1} rowsMax={10000} className={classes.input_field}></TextField>
                    <Button onclick={AddQuestion}>저장</Button>
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
                                className={classes.modal}
                            >
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