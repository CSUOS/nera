import React, {useState, useEffect} from 'react';
import { Grid, Paper, TextField, Typography, Button } from '@material-ui/core';
import { PageInfo, TimePicker, SideBar} from '../components';
import { useHistory } from "react-router-dom";
import axios from "axios";
import './pages.css';
import Modal from '@material-ui/core/Modal';

import { modifiedDateToString } from '../shared/DateToString';
import StudentPopup from '../shared/StudentPopup';
import ClearIcon from '@material-ui/icons/Clear';
import SettingsIcon from '@material-ui/icons/Settings';

function SetAssignment(props){
    const [update, forceUpdate] = useState(false); // rendering update용
    const [qOpen, setQOpen] = useState(false); // question modal 관리
    const [sOpen, setSOpen] = useState(false); // student list modal 관리

    // 강의 정보
    const [lectureName, setLecture] = useState("");
    // 과제 정보
    const [assignId, setAssignId] = useState(-1);
    const [assignName, setAssignName] = useState("");
    const [assignInfo, setAssignInfo] = useState("");
    const [modifiedDate, setModifiedDate] = useState(); // 저장 시간
    const [publishingTime, setPublishingTime] = useState(); // 발행 시간
    const [deadline, setDeadline] = useState(); // 마감 시간
    const [questions, setQuestions] = useState([]);
    const [students, setStudents] = useState([]);
    // modal state 관리
    const [renderQuestionIndex, setRenderQuestionIndex] = useState(-1); 
    const [renderQuestionName, setRenderQuestionName] = useState(""); 
    const [renderQuestionScore, setRenderQuestionScore] = useState(); 

    const history = useHistory();

    
    useEffect(()=>{
        // 처음 페이지를 불러올 때
        async function fetchData() {
            await getData();
        }

        fetchData();
    }, [props.match.params.asId]);

     // if you click question button => questionsHandleOpen();
     // if you click question +(add) button => addQuestion();
     // if you click question x(delete) button => deleteQuestion();
     // if you modify quetion modal textfield => changeRenderQuestion();
     // if you click quetions modal save button => saveRenderQuestion();


    const questionHandleOpen = (index) => {
        setQOpen(true);
        setRenderQuestionIndex(index);
        setRenderQuestionName(questions[index].questionContent);
        setRenderQuestionScore(questions[index].fullScore);
    };
    const questionHandleClose = () => {
        setQOpen(false);
    };

    const listHandleOpen = () => {
        setSOpen(true);
    };
    const listHandleClose = () => {
        setSOpen(false);
    };

        // function 


    function getData(){
        // 과제 정보 불러오기 api
        const asId = props.match.params.asId; // url의 과제id에 해당하는 정보 불러오기
        if(asId!==undefined && asId!=="add"){ // 이미 존재하는 과제 설정을 수정하는 페이지일 때
            axios
            .get(`/v1/assignment/${asId}`, { withCredentials: true })
            .then(res => {
                const data = res.data;
                setAssignId(data.assignmentId);
                setAssignInfo(data.assignmentInfo);
                let tmp = data.assignmentName.split('[');
                tmp = tmp[1].split(']');
                setLecture(tmp[0]);
                setAssignName(tmp[1]);
                setPublishingTime(data.publishingTime); 
                setDeadline(data.deadline);
                setQuestions(data.questions);
                setStudents(data.students);
            })
            .catch(err=>{
                if(err.response===undefined){
                    alert(`내부 함수 (SetAssignment.js => getData()) 문제입니다. 오류 수정 필요.`);
                }
                const status = err.response.status;
                if (status === 400) {
                    alert(`과제 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
                }
                else if (status === 401) {
                    history.push("/");
                    //alert(`과제 정보를 얻는데 실패하였습니다. 인증이 실패하였습니다. (${status})`);
                }
                else if (status === 404) {
                    alert(`과제 정보를 얻는데 실패하였습니다. 과제를 찾을 수 없습니다. (${status})`);
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }
                history.push("/home/setting");
            });
        }else{ // 새로운 과제를 추가하는 페이지일 때
            setPublishingTime(new Date());
            setDeadline(new Date());
        }
    }
        
        
    async function changeLectureField(e){
        // textfield가 바뀔 때마다 lectureName 갱신

        await setLecture(e.target.value);
        await forceUpdate(!update);
    }

    async function changeAssignNameField(e){
        // textfield가 바뀔 때마다 assignmentName 갱신

        await setAssignName(e.target.value);
        await forceUpdate(!update);
    }

    async function changeAssignInfoField(e){
        // textfield가 바뀔 때마다 Description 갱신

        await setAssignInfo(e.target.value);
        await forceUpdate(!update);
    }

    
    async function addQuestion(){
        // 새로운 문제 추가
        const index = questions.length;
        const newQuestion = {
            questionId : index,
            questionContent : "기본",
            fullScore : undefined,
        };

        let tmp = questions;
        tmp.push(newQuestion);
        await setQuestions(tmp);
        await questionHandleOpen(index);
    }

    async function changeRenderQuestion(e, type){
        // textfield가 바뀔 때마다 render state들 갱신

        if(type===0){ // 문제 설명 갱신
            await setRenderQuestionName(e.target.value);
        }else{ // 배점 갱신
            const number = Number(e.target.value);
            await setRenderQuestionScore(isNaN(number)?e.target.value:number);
        }
        await forceUpdate(!update);
    }

    async function deleteQuestion(index){
        // 문제 삭제
        let tmp = questions;
        tmp.splice(index,1);
        await forceUpdate(!update);
    }

    async function saveRenderQuestion(){
        if(isNaN(renderQuestionScore)){
            alert('배점에는 제대로 된 숫자를 입력해주세요.');
            return;
        }

        let tmp = questions;
        tmp[renderQuestionIndex].questionContent = renderQuestionName;
        tmp[renderQuestionIndex].fullScore = renderQuestionScore;

        await setQuestions(questions);
        await questionHandleClose();
    }

    
    async function saveStudentModalGroup(getStudents, getListName){
        // renderStudent => students 저장
        await setStudents(getStudents);
        await listHandleClose();
    }

    async function saveAssignmentToDB(){
        // 과제 수정/생성 API와의 연동

        await axios
        .post('/v1/assignment', {
            assignmentId : assignId,
            students : students,
            assignmentName: "["+lectureName+"]"+assignName,
            assignmentInfo: assignInfo,
            publishingTime: publishingTime,
            deadline: deadline,
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
        setModifiedDate(new Date());
        window.location.href = "/home/setting";
    }

        // function 

    return(
        <Grid container direction="column">
            <PageInfo className="assignment_info"
                icon={SettingsIcon}
                mainTitle="과제별 설정"
                subTitle="각 과제의 세부정보를 설정하는 페이지입니다." 
                information="우측 하단의 저장버튼을 누르시면 DB에 저장됩니다."/>
            <Grid container spacing={4} direction="column" className="setting_as_con contents_con">
                <Grid item className="contents_title"><h6>강의 정보</h6></Grid>
                <Grid className="setting_as_row" container item direction="row">
                    <Grid><TextField onChange={(e)=>changeLectureField(e)} helperText="강의명을 기재해주세요. ex_ 이산수학" InputLabelProps={{shrink:true}} label="강의명" required multiline rowsMax={2} value={lectureName}></TextField></Grid>
                    <Grid><TextField onChange={(e)=>changeAssignNameField(e)} helperText="과제명을 기재해주세요. 강의명과 함께 발행날짜 이전에 학생들에게 보여집니다*" InputLabelProps={{shrink:true}} label="과제명" required multiline rowsMax={2} value={assignName}></TextField></Grid>
                </Grid>
                <Grid className="setting_as_row" container item direction="row">
                    <Grid xs={12}>
                        <TextField 
                            variant="outlined" 
                            onChange={(e)=>changeAssignInfoField(e)} 
                            helperText="자세한 과제 내용과 주의사항을 기재해주세요. 문제는 아래의 문제란에 기재해주세요." 
                            InputLabelProps={{shrink:true}} 
                            label="과제 설명" 
                            required 
                            multiline 
                            rowsMax={10000} 
                            value={assignInfo}
                        ></TextField>
                    </Grid>
                </Grid>
                <Grid item>
                    {(publishingTime!==undefined && deadline!==undefined)?
                        <TimePicker
                            publishingTime = {publishingTime}
                            deadline = {deadline}
                            setPublishingTime = {setPublishingTime}
                            setDeadline = {setDeadline}
                            startHelperText="이 시각 이후로 학생들은 과제를 보고 수정할 수 있습니다."
                            endHelperText="이 시각 이후로 학생들은 과제를 수정할 수 없습니다."
                        />
                        :"Please wait..."
                    }
                </Grid>
                <Grid container item direction="column" className="contents_con">
                    <Grid className="contents_title"><h6>문제</h6></Grid>
                    <Grid container wrap="wrap" alignItems="center" className="contents box_layout" >
                        {
                            questions.map((question, index)=>
                                <Grid container className="box_container" item>
                                    <Grid item className="box_content">
                                        <Button className="box_button" onClick={()=>questionHandleOpen(index)}>
                                            <Paper className="box_name">{index+1}.{question.questionContent}</Paper>
                                        </Button>
                                    </Grid>
                                    <Grid item className="box_xbtn">
                                        <Button onClick={()=>deleteQuestion(index)}><ClearIcon/></Button>
                                    </Grid>
                                </Grid>
                            )
                        }
                        <Paper className="add_button">
                            <Button onClick={addQuestion}>
                                <Typography>문제 추가</Typography>
                            </Button>
                        </Paper>
                        <Modal
                            open={qOpen}
                            onClose={questionHandleClose}
                            aria-labelledby="add question to assignment"
                            aria-describedby="add question to assignment"
                            className="modal">
                            <Paper className="modal_con">
                                <Grid container spacing={2} wrap="wrap" className="modal_form">
                                    <TextField onChange={(e)=>changeRenderQuestion(e,0)} InputLabelProps={{shrink:true}} label="문제 설명" required multiline rows={1} rowsMax={10000} value={renderQuestionName}></TextField>
                                    <TextField 
                                        onChange={(e)=>changeRenderQuestion(e,1)} 
                                        InputLabelProps={{shrink:true}} 
                                        label="배점" required multiline 
                                        rows={1} rowsMax={10} 
                                        value={renderQuestionScore}
                                        error={typeof(renderQuestionScore)==="string"?true:false}
                                        helperText="숫자를 입력해주세요."
                                        >
                                    </TextField>
                                </Grid>
                                <Button className="save_button" onClick={()=>saveRenderQuestion()}>저장</Button>
                            </Paper>
                        </Modal>
                    </Grid>
                </Grid>
                
                <Grid container item direction="column" className="contents_con">
                    <Grid className="contents_title"><h6>수강생 목록</h6></Grid>
                    <Paper className="add_button">
                        <Button onClick={listHandleOpen}>
                            <Typography>수강생 목록 수정</Typography>
                        </Button>
                    </Paper>
                    <Typography>현재 아래에 표시된 학생들이 과제에 배정되어있습니다. <br></br>{students.map((student)=>student+" ")}</Typography>
                    <Grid>
                        <StudentPopup
                            open = {sOpen}
                            handleClose = {listHandleClose}
                            type = "get"
                            students= {students}
                            saveFunc = {saveStudentModalGroup}
                        />
                    </Grid>
                </Grid>
                
                <Grid className="assignment_saveinfo_con">
                    <Grid className="assignment_saveinfo">
                        <Typography>{modifiedDateToString(modifiedDate)}</Typography>
                        <Button className="save_button" onClick={saveAssignmentToDB}>저장</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default SetAssignment;