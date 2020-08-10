import React, { useState, useEffect } from 'react';
import axios from "axios";
import {Link, Redirect} from 'react-router-dom';
import { Grid, TextField, Button, Typography } from '@material-ui/core';

function Login(){
    // id, password
    const [id,setId]= useState();
    const [pw,setPw]= useState();
    const [hide, setHide] = useState(false); // hide form or not

    // Main으로 넘겨줄 정보들
    const [name, setName] = useState("");
    const [user_number, setUNumber] = useState(-1);
    const [meta, setMeta] = useState(Date());

    async function setLoginData(e){ // pw 암호화 및 api data 받기
        try{
            const sha256 = require('sha256');
            const secret = process.env.REACT_APP_SECRET;
            const hashed_pw = sha256(pw + secret);
            
            await axios.post('/v1/auth', {
                userId: id,
                userPw: hashed_pw,
            }).then((response) => setDataAndMove(response));
        }catch(e){
            // error 처리 어떻게 할까요?
            console.log(e);
        }
    }

    async function setDataAndMove(response){ // api data를 state에 저장, home으로 이동 버튼 띄우기
        try{
            setName(response.data.userName);
            setUNumber(response.data.userNumber);
            let meta = {create_at : Date(), modified_at : Date()};
            meta.create_at = response.data.meta.createAt;
            meta.modified_at = response.data.meta.modifiedAt;
            setMeta(meta);
            
        }catch(e){
            console.log(e);
        }
    };

    function changeId(){
        const id = document.querySelector('#userId');
        setId(id.value);
    }

    function changePw(){
        const password = document.querySelector('#userPw');
        setPw(password.value);
    }

    useEffect(()=>{

    });

    return (
        <Grid className="Login">
            <form method="post">
                <Grid container alignItems="center" justifycontents="center" className="login_container" direction="column">
                    <Typography variant="h5">로그인</Typography>
                    <TextField variant="outlined" id="userId" label="id" required rows={1} rowsMax={10} onChange={changeId}></TextField>
                    <TextField variant="outlined" id="userPw" label="password" type="password" required rows={1} rowsMax={10} onChange={changePw}></TextField>
                    <Button onClick={setLoginData}>login</Button>
                </Grid>
            </form>
        </Grid>
    );
}
export default Login