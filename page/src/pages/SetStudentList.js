import React, { useEffect, useState } from 'react';
import { Grid, Paper, Button, Typography } from '@material-ui/core';
import { PageInfo } from '../components';
import { useHistory } from "react-router-dom";
import axios from "axios";
import XLSX from 'xlsx';
import './pages.css';

import SettingsIcon from '@material-ui/icons/Settings';
import ClearIcon from '@material-ui/icons/Clear';
import StudentPopup from '../shared/StudentPopup';

function SetStudentList(props){
    const [update, forceUpdate] = useState(false); // rendering update용
    const [open, setOpen] = useState(false);
    const [group, setGroup] = useState([]);
    const [students, setStudents] = useState([]);
    const [listName, setListName] = useState("");
    const [groupId, setGroupId] = useState(-1);
    const history = useHistory();
    
    
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
        .catch((err)=>{
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
                setGroup([]);
                return;
            }
            else if (status === 500) {
                alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
            }
            history.push("/home");
        });
    }

    async function saveModalGroup(getStudents, getListName){
        // modal에서 저장 버튼을 눌렀을 때
        // 현재 모달의 내용 저장 후,
        // 다시 수강생 목록 받아오기

        await axios
        .post('/v1/student',{
            className: getListName,
            students : getStudents,
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

    async function deleteGroup(index){
        // 그룹 삭제
        const string = "그룹 \""+group[index].className+"\" 을(를) 정말로 삭제할까요?";
        if(window.confirm(string)==false){
            return;
        }
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
            history.push("/home/setList");
        });
        await getData();
        await forceUpdate(!update);
    }

    async function addGroup(){
        // 새로운 과제 세팅
        await setStudents([]);
        await setListName("");
        await setGroupId(-1);
        await handleOpen();
    }


    function uploadXlsxFile(e) {
        const f = e.target.files[0];

        const reader = new FileReader();
        reader.onload = (evt) => { // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, {type:'binary'});
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            /* Update state */
            console.log(data);
            data.forEach(element => {
                if(isNaN(element['학번'])) {
                    alert('학번은 숫자만 입력 가능합니다.');
                    students = [];
                    handleClose();
                }
                students.push(element['학번']);
                history.push('/home/setList');
            });
            
        };
        reader.readAsBinaryString(f);
    }
        // function 

    return(
        <Grid container direction="column">
            <PageInfo className="student_list_info"
                icon={SettingsIcon}
                mainTitle="수강생 목록 관리"
                subTitle="수강생 목록을 추가 / 수정 하는 페이지 입니다." 
                information="수강생 목록의 세부 정보를 수정하시려면 수강생 목록명을 클릭하세요. 수강생 목록을 추가하시려면 '수강생 목록 추가' 버튼을 눌러주세요."/>
            <Grid container direction="column" className="contents_con">
                <Grid className="contents_title"><h6>수강생 목록</h6></Grid>
                <Grid container wrap="wrap" alignItems="center" className="contents box_layout" >
                {
                    group.length==0?
                    <Grid item>
                        <Typography variant="h6">수강생 목록이 없습니다. 생성해주세요!</Typography>
                    </Grid>
                    :group.map((gr, index)=>(
                        <Grid container className="box_container" item>
                            <Grid item className="box_content">
                                <Button className="box_button" onClick={()=> selectGroup(gr, index)}>
                                    <Paper className="box_name">{gr.className}</Paper>
                                </Button>
                            </Grid>
                            <Grid item className="box_xbtn"><Button onClick={() => deleteGroup(index)}><ClearIcon/></Button></Grid>
                        </Grid>
                        )
                    )
                }
                </Grid>
                <Grid item className="contents_box">
                    <Paper className="add_button">
                        <Button onClick={addGroup}>
                            <Typography>수강생 목록 추가</Typography>
                        </Button>
                    </Paper>
                </Grid>
                <StudentPopup
                    open = {open}
                    handleClose = {handleClose}
                    type = "set"
                    students= {students}
                    listName = {listName}
                    saveFunc = {saveModalGroup}
                />
            </Grid>
        </Grid>
    );
}

export default SetStudentList;