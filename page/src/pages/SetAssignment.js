import React, {useState, useEffect} from 'react';
import { Grid, Paper, TextField, Typography, Button } from '@material-ui/core';
import { PageInfo, TimePicker } from '../components';
import { useHistory } from "react-router-dom";
import axios from "axios";

import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ClearIcon from '@material-ui/icons/Clear';
import Modal from '@material-ui/core/Modal';


function SetAssignment(props){
    const [open, setOpen] = useState(false); // modal 관리
    const [assignInfo, setAssignInfo] = useState("");
    const [lectureName, setLecture] = useState("");
    const [assignName, setAssignName] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [questions, setQuestions] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentList, setStudentList] = useState({});
    const [renderObject, setRenderObject] = useState([]); // modal에 rendering되는 학생목록 관리

    const history = useHistory();

    
    useEffect(()=>{
        // 처음 페이지를 불러올 때
        async function fetchData() {
            await getData();
            console.log(startDate);
        }

        fetchData();
    }, [props.match.params.asId]);

    useEffect(()=>{
        // students가 바뀔 때마다 renderObject에 똑같이 저장
        let tmp = [];
        students.forEach((student)=>{ // 깊은 복사 (값 복사)
            tmp.push(student);
        })
        setRenderObject(tmp);
    }, [students])


     // if you click modal's outside => just handleClose();
     // if you click modal's + button => addStudents();
     // if you click modal's x button => deleteStudents();
     // if you modify modal's textfield => changeStudentField();
     // if you click modal's save button => closePopUp();

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    function getData(){
        const asId = props.match.params.asId; // url의 과제id에 해당하는 정보 불러오기
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
                setAssignName(tmp[1]);
                setStartDate(data.publishingTime); 
                setEndDate(data.deadline); 
                setQuestions(data.questions);
                setStudents(data.students);
            })
            .catch(err=>{
                if(err.response===undefined){
                    alert(`내부 함수 (SetAssignment.js => getDate()) 문제입니다. 오류 수정 필요.`);
                }
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
    
    async function addStudents(){
        // 학생 리스트 추가
        let tmp = renderObject;
        tmp.push(undefined);
        await setRenderObject(tmp);
        await handleClose();
        await handleOpen();
    }

    async function deleteStudents(index){
        // 학생 리스트 삭제
        let tmp = renderObject;
        tmp.splice(index,1);
        await setRenderObject(tmp);
        await handleClose();
        await handleOpen();
    }

    function changeStudentField(e, index){
        // testfield가 바뀔 때마다 renderObject 갱신
        let tmp = renderObject;
        let tmp_number = Number(e.target.value);
        if(tmp_number!==NaN){
            tmp[index] = tmp_number;
        }else{
            tmp[index] = undefined;
        }
        setRenderObject(tmp);
    }

    function saveStudents(){
        // renderObject => students 저장
        setStudents(renderObject);
    }

    async function closePopUp(){
        // modal을 그냥 닫으면 handleClose만 적용되어 student state에 저장 x
        // 저장 버튼을 눌러야 student state에 저장됨
        await saveStudents();
        await handleClose();
    }

    function preProcessingData(){
        // 빈 student textfield가 있으면 없애기
        let tmp = students;
        tmp.map((student, index)=>{
            if(student===undefined){
                tmp.splice(index,1);
            }
        });
        setStudents(tmp);
    }

    async function saveAssignmentToDB(){
        // 과제 수정/생성 API와의 연동

        await preProcessingData();
        await axios
        .post('/v1/assignment', {
            students : students,
            assignmentName: "["+lectureName+"]"+assignName,
            assignmentInfo: assignInfo,
            publishingTime: startDate,
            deadline: endDate,
            questions: questions
        } , { withCredentials: true })
        .catch(err=>{
            if(err.response===undefined){
                alert(`내부 함수 (SetAssignment.js => saveAssignmentToDB()) 문제입니다. 오류 수정 필요.`);
            }
            const status = err.response.status;
            if (status === 400) {
                alert(`과제 정보를 저장하는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
            }
            else if (status === 401) {
                alert(`과제 정보를 저장하는데 실패하였습니다. 인증이 실패하였습니다. (${status})`);
            }
            else if (status === 403) {
                alert(`과제 정보를 저장하는데 실패하였습니다. 권한이 없습니다. (${status})`);
            }
            else if (status === 404) {
                alert(`과제 정보를 저장하는데 실패하였습니다. 과제를 찾을 수 없습니다. (${status})`);
            }
            else if (status === 500) {
                alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
            }
            history.push("/home/setting");
        });
        history.push("/home/setting");
    }

    function getStudentList(){
        axios
        .get('/v1/student', { withCredentials: true })
        .then(res => {
            let tmp = {};
            res.data.map((list)=>{
                tmp[list.className]=list.students;
            })
            setStudentList(tmp);
        })
        .catch(err=>{
            if(err.response===undefined){
                alert(`내부 함수 (SetAssignment.js => getStudentList()) 문제입니다. 오류 수정 필요.`);
            }else{
                const status = err.response.status;
                if (status === 400) {
                    alert(`수강생 목록 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
                }
                else if (status === 401) {
                    alert(`수강생 목록 정보를 얻는데 실패하였습니다. 인증이 실패하였습니다. (${status})`);
                }
                else if (status === 403) {
                    alert(`수강생 목록 정보를 얻는데 실패하였습니다. 권한이 없습니다. (${status})`);
                }
                else if (status === 404) {
                    alert(`수강생 목록 정보를 얻는데 실패하였습니다. 수강생 목록을 찾을 수 없습니다. (${status})`);
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }
            }
            history.push("/home");
        });
    }


    function renderStudentList(){
        let result= [];
        for (const [name, list] of Object.entries(studentList)) {
            result.push(
                <Button onClick={()=>setStudents(list)}>{name}</Button>
            )
        };
        return result;
    }

    return(
        <Grid container spacing={6} direction="column">
            <Grid container item direction="row" alignItems="center">
                <Grid item xs={9}>
                    <PageInfo className="assignment_info"
                        icon={SettingsIcon}
                        mainTitle="과제별 설정"
                        subTitle="" />
                </Grid>
                <Grid item xs={3}>
                    <Button className="save_button" onClick={saveAssignmentToDB}>저장</Button>
                </Grid>
            </Grid>
            <Grid container item spacing={4} direction="column" className="setting_as_con">
                <Grid container item direction="row">
                    <Grid xs={6}><TextField InputLabelProps={{shrink:true}} label="강의명" required multiline rows={1} rowsMax={10000} defaultValue={lectureName}></TextField></Grid>
                    <Grid xs={6}><TextField InputLabelProps={{shrink:true}} label="과제명" required multiline rows={1} rowsMax={10000} defaultValue={assignName}></TextField></Grid>
                </Grid>
                <Grid item>
                    <TimePicker
                        startDate = {startDate}
                        endDate = {endDate}
                    />
                </Grid>
                <Grid container item direction="row">
                    <Grid xs={6}><TextField InputLabelProps={{shrink:true}} label="과제 설명" required multiline rows={1} rowsMax={10000} defaultValue={assignInfo}></TextField></Grid>
                </Grid>
                <Grid container item direction="row">
                    <Grid container spacing={1} xs={12}>
                        <Grid item>
                            <Typography variant="h6">문제</Typography>
                        </Grid>
                        <Grid container item spacing={2} direction="row" wrap="wrap">
                            {
                                questions.map((question, index)=>
                                    <Grid item>
                                        <Typography>문제 #{index+1}</Typography>
                                        <TextField InputLabelProps={{shrink:true}} label="문제 설명" required multiline rows={1} rowsMax={10000} defaultValue={question.questionContent}></TextField>
                                        <TextField InputLabelProps={{shrink:true}} label="배점" required multiline rows={1} rowsMax={10} defaultValue={question.fullScore}></TextField>
                                    </Grid>
                                )
                            }
                        </Grid>
                    </Grid>
                </Grid>
                
                <Grid container item direction="column">
                    <Grid><Button onClick={handleOpen}>수강생 목록</Button></Grid>
                    <Grid>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="add question to assignment"
                            aria-describedby="add question to assignment"
                            className="modal">
                            <Paper className="modal_con">
                                <Grid container spacing={2} wrap="wrap" className="modal_form">
                                    <Grid container item  xs={12}>
                                        <Button onClick={getStudentList}>수강생 목록 불러오기</Button>
                                        {renderStudentList()}
                                        <Button className="save_button" onClick={closePopUp}>저장</Button>
                                    </Grid>
                                    {
                                        renderObject.map((student, index)=>
                                            <Grid item xs={3}>
                                                <TextField onInput={(e)=>changeStudentField(e, index)} className="popup_student" InputLabelProps={{shrink:true}} label={"학생"+(index+1)} required multiline rows={1} rowsMax={15} defaultValue={student}></TextField>
                                                <Button onClick={()=>deleteStudents(index)}><ClearIcon/></Button>
                                            </Grid>
                                        )
                                    }
                                    <AddCircleIcon fontSize="large" onClick={addStudents}></AddCircleIcon>
                                </Grid>
                            </Paper>
                        </Modal>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default SetAssignment;