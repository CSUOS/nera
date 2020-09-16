import React, { useEffect, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import { Grid, Paper, TextField, Button} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import axios from "axios";
import XLSX from 'xlsx';
import PropTypes from 'prop-types';
import ClearIcon from '@material-ui/icons/Clear';

import '../pages/pages.css';
import './shared.css'; //shared.css로 옮기기

function StudentPopUp (props){
    const [update, forceUpdate] = useState(false); // rendering update용
    const [students, setStudents] = useState([]);
    const [listName, setListName] = useState("");
    const [studentList, setStudentList] = useState({});
    const history = useHistory();

    useEffect(()=>{
        setStudents(props.students);
        setListName(props.listName);
    },[props]);
    
    // get에서 수강생목록 다루기
    
    function getStudentList(){
        // 수강생 목록 불러오기 api
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
                    history.push("/");
                    //alert(`수강생 목록 정보를 얻는데 실패하였습니다. 인증이 실패하였습니다. (${status})`);
                }
                else if (status === 403) {
                    alert(`수강생 목록 정보를 얻는데 실패하였습니다. 권한이 없습니다. (${status})`);
                }
                else if (status === 404) {
                    return;
                }
                else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
                }
            }
            history.push("/home");
        });
    }

    function renderStudentList(){
        // 수강생 목록 띄우기
        let result= [];
        for (const [name, list] of Object.entries(studentList)) {
            result.push(
                <Button onClick={()=>changeStudentList(name, list)}>{name}</Button>
            )
        };
        return result;
    }

    async function changeStudentList(name, list){
        await setListName(name);
        await setStudents(list);
        await forceUpdate(!update);
    }

    // student field

    async function changeStudent(e, index){
        // textfield가 바뀔 때마다 students 갱신
        let tmp = students;
        if(e.target.value===undefined){
            //아무것도 없을 경우
            tmp[index] = undefined;
        }else {
            //숫자면 숫자형태로 변형
            const number = Number(e.target.value);
            if(isNaN(number)||number===0)
                tmp[index] = e.target.value;
            else
                tmp[index] = number;
        }

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

    async function deleteStudent(index){
        let tmp = students;
        tmp.splice(index,1);
        await setStudents(tmp);
        await forceUpdate(!update);
    }

    // 전처리

    function preProcessingStudentData(){
        // 데이터 전처리
        let tmp = students;
        let returnString="";
        
        if(listName===""){
            return "목록 이름이 비어있습니다. 입력해주세요.";
        }

        tmp.map((student, index)=>{
            if(student===undefined){
                // 빈 student textfield가 있으면 없애기
                tmp.splice(index,1);
            }
            let olStudents = isStudentsValid();
            if(Object.keys(olStudents).length!==0){
                highlightOverlap(olStudents);
                returnString = "수강생 학번 중 겹치는 학번이 있습니다.";
                return;
            }
            if(isNaN(Number(student))){
                // 학번이 숫자가 아니면
                returnString = "학번이 숫자가 아닙니다.";
                return;
            }
            if(student<1000000000 || student>=3000000000){
                // 학번이 정상 범위가 아니면
                returnString = "학번이 정상 범위가 아닙니다.";
                return;
            }
        });
        setStudents(tmp);
        return returnString; // 정상
    }
    
    function highlightOverlap(olStudents){
        // 번호가 겹치는 학생 표시
        for(let number in olStudents){ // number : index
            const studentTag = document.getElementById("modal_student"+number);
            studentTag.style="color:red;"
        }
    }

    function initializeHighlight(){
        // highlight 없애기 (초기화)
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

    // 저장
    
    async function saveStudentList(){
        await initializeHighlight();
        
        const errorMessage = await preProcessingStudentData();
        if(errorMessage!==""){
            alert(errorMessage);
            return;
        }

        props.saveFunc(students, listName);
    }
    function uploadXlsxFile(e) {
        const f = e.target.files[0];
        if (f === undefined) return;
        const check = f.name.slice(f.name.indexOf(".") + 1).toLowerCase();

        if (check !== 'csv' && check !== 'xlsx') {
            alert('.csv, .xlsx 파일만 등록 가능합니다.');
            return;
        }
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
                students.push(element['학번']);
                history.push('/home/setList');
            });
            
        };
        reader.readAsBinaryString(f);
    }
    // type마다 달라지는 contents
    
    const headerContent = ()=>{
        if(props.type==="set"){
            // 수강생 목록 생성
            return(
                <Grid container item alignItems="center">
                    <TextField label="목록 이름" required onInput={(e)=>setListName(e.target.value)} rows={1} className="modal_input_field" value={listName}></TextField>
                    <input type="file" name="student_list_xlsx" onChange={uploadXlsxFile.bind(this)}/>
                    <Button className="save_button" onClick={saveStudentList}>저장</Button>
                </Grid>
            );
        }else if(props.type==="get"){
            // 수강생 목록 조회
            return(
                <Grid container item alignItems="center">
                    <Button onClick={getStudentList}>수강생 목록 불러오기</Button>
                    {renderStudentList()}
                    <Button className="save_button" onClick={saveStudentList}>저장</Button>
                </Grid>
            );
        }
    }
    

    return(
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="student-modal"
            aria-describedby="수강생 목록 모달입니다."
            className="modal">
            <Paper className="modal_con">
                <Grid container>
                    {headerContent()}
                    <Grid container item alignItems="center" wrap="wrap">
                        {
                            students.map((student, index)=>
                                <Grid item className="box_container">
                                    <Grid item className="box_content">
                                        <TextField  label={"학생"+(index+1)} 
                                                    InputLabelProps={{ shrink: true }}
                                                    rows={1}
                                                    onInput={(e)=>changeStudent(e, index)} 
                                                    className={"modal_students modal_input_field"}
                                                    id={"modal_student"+index} 
                                                    value={student}
                                                    error={typeof(student)==="string"?true:false}
                                                    helperText="숫자를 입력해주세요."
                                                    >
                                        </TextField>
                                    </Grid>
                                    <Grid item className="box_xbtn">
                                        <Button onClick={()=>deleteStudent(index)}><ClearIcon/></Button>
                                    </Grid>
                                </Grid>
                            )
                        }
                        <Button className="add_button" onClick={addStudent}>학생 추가</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Modal>
    );
}

StudentPopUp.propTypes ={
    open: PropTypes.bool,
    handleClose : PropTypes.func,
    type: PropTypes.string,
    students : PropTypes.array,
    listName : PropTypes.string,
    saveFunc: PropTypes.func
};

export default StudentPopUp;