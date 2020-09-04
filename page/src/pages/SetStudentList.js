import React, { useEffect, useState } from 'react';
import { Grid, Paper, TextField, Button, Typography } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { PageInfo } from '../components';
import axios from "axios";
import './pages.css';

import SettingsIcon from '@material-ui/icons/Settings';
import ClearIcon from '@material-ui/icons/Clear';

function SetStudentList(props){
    const [update, forceUpdate] = useState(false); // rendering update용
    const [open, setOpen] = useState(false);
    const [group, setGroup] = useState([]);
    const [students, setStudents] = useState([]);
    const [listName, setListName] = useState("");
    const [groupId, setGroupId] = useState(-1);
    
    useEffect(()=>{
        getData();
    },[]);
    
     // if you click list's x button => deleteGroup();
     // if you click list => selectGroup();
     // if you click list '수강생 목록 생성' button => addGroup();
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
    };
        // function

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

    async function saveModalGroup(){
        // modal에서 저장 버튼을 눌렀을 때
        // 현재 모달의 내용 저장 후,
        // 다시 수강생 목록 받아오기

        if(!window.confirm('저장 시 목록명을 바꿀 수 없습니다. 저장할까요?'))
            return;

        await initializeHighlight();
        let olStudents = isStudentsValid();
        console.log(olStudents);
        if(Object.keys(olStudents).length!==0){
            alert('수강생 학번 중 겹치는 학번이 있습니다.');
            highlightOverlap(olStudents);
            return;
        }
        
        if(listName===""){
            alert('목록 이름이 비어있습니다. 입력해주세요.');
            return;
        }

        await axios
        .post('/v1/student',{
            className: listName,
            students : students,
            groupId : groupId
        }, { withCredentials: true })
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
        await handleClose();
        await getData();
        await forceUpdate(!update);
    }

    async function selectGroup(group){
        await setStudents(group["students"]);
        await setListName(group["className"]);
        await setGroupId(group["groupId"]);
        await handleOpen();
    }

    async function changeListName(e){
        await setListName(e.target.value);
        await forceUpdate(!update);
    }

    async function changeListStudent(e, index){
        let tmp = students;
        let number = Number(e.target.value);
        tmp[index] = isNaN(number)?e.target.value:number;

        await initializeHighlight();

        await setStudents(tmp);
        await forceUpdate(!update);
    }
    
    async function addStudent(){
        // 새로운 학번 추가
        let tmp = students;
        tmp.push(undefined);
        await setStudents(tmp);
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
                    alert(`내부 함수 (SetStudentList.js => deleteGroup()) 문제입니다. 오류 수정 필요.`);
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
            await getData();
            await forceUpdate(!update);
        }
    }

    async function addGroup(){
        // 새로운 과제 세팅
        await setStudents([]);
        await setListName("");
        await setGroupId(-1);
        await handleOpen();
    }

    function isStudentsValid(){
        let tmp = {}; // key : 학번, value : index
        let result = {}; // key : index, value : 학번
        for(let i=0; i<students.length; i++){
            if(Object.prototype.hasOwnProperty.call(tmp,students[i])){
                result[i] = students[i];
                continue;
            }
            tmp[students[i]]=i;
        }

        return result;
    }

    function highlightOverlap(olStudents){
        for(let number in olStudents){ // number : index
            const studentTag = document.getElementById("modal_student"+number);
            studentTag.style="color:red;"
        }
    }

    function initializeHighlight(){
        let studentsTag = document.getElementsByClassName("modal_students");
        for(let index in studentsTag){
            if(index!=="length"){
                let inputTag = studentsTag[index].children[1].children[0];
                inputTag.style="";
            }
            else
                break;
        }
    }

        // function 

    return(
        <Grid container direction="column">
            <PageInfo className="student_list_info"
                icon={SettingsIcon}
                mainTitle="수강생 목록 관리"
                subTitle="" />
            <Grid container wrap="wrap" alignItems="center" spacing="1">
                {
                    group.length==0?
                    <Grid item>
                        <Typography variant="h6">수강생 목록이 없습니다. 생성해주세요!</Typography>
                    </Grid>
                    :group.map((gr, index)=>(
                        <Grid item flex="3" className="student_list_con">
                            <Paper>
                                <Button onClick={() => selectGroup(gr, index)}>{gr.className}</Button>
                                <Button onClick={() => deleteGroup(index)}><ClearIcon/></Button>
                            </Paper>
                        </Grid>
                        )
                    )
                }
                <Grid item flex="3" className="student_list_con">
                    <Paper>
                        <Button onClick={()=> addGroup()}>수강생 목록 생성</Button>
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
                                <TextField label="목록 이름" disabled={groupId===-1?false:true} required onInput={changeListName} rows={1} rowsMax={10000} className="modal_input_field" value={listName}></TextField>
                                <Button className="save_button" onClick={()=>saveModalGroup()}>저장</Button>
                            </Grid>
                            <Grid container item alignItems="center" wrap="wrap">
                                {
                                    students.map((student, index)=>
                                        <Grid item>
                                            <TextField  label={"학생"+(index+1)} 
                                                        rows={1} rowsMax={10000} 
                                                        onInput={(e)=>changeListStudent(e, index)} 
                                                        className={"modal_students"}
                                                        id={"modal_student"+index} 
                                                        value={student}
                                                        error={typeof(student)==="string"?true:false}
                                                        helperText="숫자를 입력해주세요."
                                                        >
                                            </TextField>
                                        </Grid>
                                    )
                                    
                                }
                                <Button class="add_button" onClick={addStudent}>학생 추가</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Modal>
            </Grid>
        </Grid>
    );
}

export default SetStudentList;