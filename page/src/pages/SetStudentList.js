import React, { useEffect, useState } from 'react';
import { Grid, Paper, TextField, Button, Typography } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { PageInfo } from '../components';
import axios from "axios";
import './pages.css';

import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ClearIcon from '@material-ui/icons/Clear';

function SetStudentList(props){
    const [update, forceUpdate] = useState(false); // rendering update용
    const [open, setOpen] = useState(false);
    const [group, setGroup] = useState([]);
    const [selected, setSelected] = useState(-1);
    const [selectedGroup, setSelGroup] = useState({"students":[undefined], "className":"", "groupId":-1});
    
    useEffect(()=>{
        function getData(){
            // 수강생 그룹 목록 불러오기 api
            axios
            .get('/v1/student', { withCredentials: true })
            .then(res => {
                setGroup(res.data);
            })
            .catch(err=>{
                if(err.response===undefined){
                    alert(`내부 함수 (SetStudentList.js => getData()) 문제입니다. 오류 수정 필요.`);
                }
                const status = err.response.status;
                if (status === 400) {
                    alert(`수강생 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
                }
                else if (status === 401) {
                    alert(`수강생 정보를 얻는데 실패하였습니다. 인증이 실패하였습니다. (${status})`);
                }
                else if (status === 403) {
                    alert(`수강생 정보를 얻는데 실패하였습니다. 권한이 없습니다. (${status})`);
                }
                else if (status === 404) {
                    return;
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }
                //history.push("/home");
            });
        }
        getData();
    },[]);
    
     // if you click list's x button => deleteGroup();
     // if you click list => selectGroup();
     // if you click list + button => addSelGroup();
     // if you modify modal's list name => changeListName();
     // if you modify modal's list student => changeListStudent();
     // if you click modal's + button => addStudent();
     // if you click modal's save button => saveModalGroup();
     // if you click modal's outside => just handleClose();

    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
        // 빈 칸 빼고 업데이트 api 
    };
        // function

    async function saveModalGroup(){
        // modal에서 저장 버튼을 눌렀을 때
        // 현재 selectedGroup의 내용 저장
        // group 수정 / 생성 api

        await axios
        .post('/v1/student',{
            className: selectedGroup.className,
            students : selectedGroup.students,
            groupId : selectedGroup.groupId
        }, { withCredentials: true })
        .then(res => {
            console.log(res)
        })
        .catch(err=>{
            if(err.response===undefined){
                alert(`내부 함수 (SetStudentList.js => saveModalGroup()) 문제입니다. 오류 수정 필요.`);
            }
            const status = err.response.status;
            if (status === 400) {
                alert(`수강생 정보를 저장하는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
            }
            else if (status === 401) {
                alert(`수강생 정보를 저장하는데 실패하였습니다. 인증이 실패하였습니다. (${status})`);
            }
            else if (status === 403) {
                alert(`수강생 정보를 저장하는데 실패하였습니다. 권한이 없습니다. (${status})`);
            }
            else if (status === 500) {
                alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
            }
            //history.push("/home/setList");
        });
        await selToGroup();
        await handleClose();
        await forceUpdate(!update);
    }

    async function selectGroup(group, index){
        await setSelGroup(group);
        await setSelected(index);
        await handleOpen();
    }

    async function changeListName(e){
        let tmp = selectedGroup;

        tmp.className = e.target.value;
        await setSelGroup(tmp);
        await forceUpdate(!update);
    }

    async function changeListStudent(e, index){
        let tmp = selectedGroup;

        let number = Number(e.target.value);
        if(number!==NaN){
            tmp.students[index] = number;
        }else{
            tmp.students[index] = undefined;
        }

        await setSelGroup(tmp);
        await forceUpdate(!update);
    }
    
    async function addStudent(){
        // selected group의 students 배열에 학번 추가
        let tmp = selectedGroup;
        tmp.students.push(undefined);
        await setSelGroup(tmp);
        await forceUpdate(!update);
    }

    async function deleteGroup(index){
        // 그룹 삭제
        const string = "그룹 ["+group[index].className+"] 를 정말로 삭제할까요?";
        if(window.confirm(string)==true){
            await axios
            .delete(`/v1/student/${group[index].groupId}`, { withCredentials: true })
            .then(res => {
                console.log(res)
            })
            .catch(err=>{
                if(err.response===undefined){
                    alert(`내부 함수 (SetStudentList.js => saveModalGroup()) 문제입니다. 오류 수정 필요.`);
                }
                const status = err.response.status;
                if (status === 401) {
                    alert(`수강생 정보를 삭제하는데 실패하였습니다. 인증이 실패하였습니다. (${status})`);
                }
                else if (status === 403) {
                    alert(`수강생 정보를 삭제하는데 실패하였습니다. 권한이 없습니다. (${status})`);
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }
                //history.push("/home");
            });
            await deleteSelInGroup(index);
            await forceUpdate(!update);
        }
    }

        function deleteSelInGroup(index){
            let tmp = group;
            tmp.splice(index,1);
            setGroup(group);
        }

    async function addSelGroup(){
        // 새로운 과제 세팅
        await setSelected(-1);
        await setSelGroup({"students":[undefined], "className":"", "groupId":-1});
        await forceUpdate(!update);
        await handleOpen();
    }
    
    function selToGroup(){
        // selectedGroup => group 반영
        let tmp = group;
        if(selected==-1){
            // 새로운 과제 추가
            tmp.push(selectedGroup);
        }else{
            // 기존에 존재하는 과제 수정
            tmp[selected] = selectedGroup;
        }

        setGroup(tmp);
    }

        // function 

    return(
        <Grid container direction="column">
            <PageInfo className="student_list_info"
                icon={SettingsIcon}
                mainTitle="수강생 목록 관리"
                subTitle="" />
            <Grid container wrap="wrap" alignItems="center">
                {
                    group.length==0?
                    <Grid>
                        <Typography variang="h6">수강생 목록이 없습니다.<br/>생성해주세요!</Typography>
                    </Grid>
                    :group.map((gr, index)=>(
                        <Grid flex="3" className="student_list_con">
                            <Paper>
                                <Button onClick={() => selectGroup(gr, index)}>{gr.className}</Button>
                                <Button onClick={() => deleteGroup(index)}><ClearIcon/></Button>
                            </Paper>
                        </Grid>
                        )
                    )
                }
                <Grid flex="3" className="student_list_con">
                    <Paper>
                        <AddCircleIcon onClick={()=> addSelGroup()}/>
                    </Paper>
                </Grid>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    className="modal">
                    <Paper className="modal_con">
                        <Grid container>
                            <Grid container item alignItems="center">
                                {selected==-1?
                                    <TextField label="목록 이름" required onInput={(e)=>changeListName(e)} rows={1} rowsMax={10000} className="modal_input_field" defaultValue={selectedGroup["className"]}></TextField>
                                    :
                                    <TextField label="목록 이름" required disabled="true" rows={1} rowsMax={10000} className="modal_input_field" defaultValue={selectedGroup["className"]}></TextField>
                                }
                                <Button className="save_button" onClick={()=>saveModalGroup()}>저장</Button>
                            </Grid>
                            <Grid container item alignItems="center" wrap="wrap">
                                { // selected group state의 students 배열 표시
                                    
                                    selectedGroup["students"].map((student, index)=>
                                        <Grid item>
                                            <TextField label={"학생"+(index+1)} rows={1} rowsMax={10000} onInput={(e)=>changeListStudent(e, index)} className="modal_input_field" defaultValue={student}></TextField>
                                        </Grid>
                                    )
                                    
                                }
                                <AddCircleIcon className="add_button" onClick={addStudent}/>
                            </Grid>
                        </Grid>
                    </Paper>
                </Modal>
            </Grid>
        </Grid>
    );
}

export default SetStudentList;