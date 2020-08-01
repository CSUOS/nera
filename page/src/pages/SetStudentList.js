import React from 'react';
import { Grid, Paper, TextField} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import {PageInfo} from '../components';

import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleIcon from '@material-ui/icons/AddCircle';

function SetStudentList(){
    const professor = 10203040; // professor = user_number;
    let group_list = [];
    
    // api로 professor에 해당하는 그룹 받아오기
    let group = {
        "group_id":0,
        "class_name":"수강생 목록 1",
        "students" : [2017920038, 2017920039, 2017920040],
    }
    let group2 = {
        "group_id":1,
        "class_name":"수강생 목록 2",
        "students" : [2017920041, 2017920042, 2017920043],
    }
    let group3 = {
        "group_id":2,
        "class_name":"수강생 목록 3",
        "students" : [2017920041, 2017920042, 2017920043],
    }
    let group4 = {
        "group_id":3,
        "class_name":"수강생 목록 4",
        "students" : [2017920041, 2017920042, 2017920043],
    }
    let group5 = {
        "group_id":4,
        "class_name":"수강생 목록 5",
        "students" : [2017920041, 2017920042, 2017920043],
    }
    group_list.push(group);
    group_list.push(group2);
    group_list.push(group3);
    group_list.push(group4);
    group_list.push(group5);
    
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    
    function AddList(){

    }
    
    function getStudentList(gr){
        return (
            <Grid flex="3" className="student_list_con" onclick={handleOpen}>
                <Paper>
                    {gr.class_name}
                </Paper>
            </Grid>
        );
    }


    function PrintModal(){
        return(
            <Paper>
                <form>
                    <TextField label="문제 제목" required rows={1} rowsMax={10000}></TextField>
                    <TextField label="문제 내용" required multiline rows={1} rowsMax={10000}></TextField>
                    <TextField label="문제 설명" required multiline rows={1} rowsMax={10000}></TextField>
                    <TextField label="배점" required rows={1} rowsMax={10000}></TextField>
                    <button onclick={AddList}>저장</button>
                </form>
            </Paper>
        );
    }

    return(
        <Grid container direction="column">
            <PageInfo className="student_list_info"
                icon={SettingsIcon}
                mainTitle="수강생 목록 관리"
                subTitle="" />
            <Grid container wrap="wrap" alignItems="center">
                {
                    group_list.map((gr)=>getStudentList(gr))
                }
                <Grid flex="3" className="student_list_con" onclick={handleOpen}>
                    <Paper>
                        <AddCircleIcon/>
                    </Paper>
                </Grid>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {PrintModal()}
                </Modal>
            </Grid>
        </Grid>
    );
}

export default SetStudentList;