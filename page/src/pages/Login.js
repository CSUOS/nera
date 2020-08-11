import React, { useState } from 'react';
import axios from "axios";
import { Grid, TextField, Button, Typography } from '@material-ui/core';

function Login(){
    // id, password
    const [id,setId]= useState();
    const [pw,setPw]= useState();


    String.prototype.hexEncode = function(){ // string to hex code
        var hex, i;
    
        var result = "";
        for (i=0; i<this.length; i++) {
            hex = this.charCodeAt(i).toString(16);
            result += ("000"+hex).slice(-4);
        }
    
        return result
    }

    async function hashProcess(){
        const sha256 = require('sha256');
        const hashed_token = await axios.get('/v1/token',{
        }).catch((e)=>{
            if(e.response.status==404){
                alert("내부 서버 오류로 token을 찾을 수 없습니다. 로그인을 다시 시도해주세요.");
            }
        });

        // base64
        let hashed_pw = btoa(pw);
        // hash sha256
        hashed_pw = sha256(hashed_pw);
        // hex encoding
        hashed_pw = hashed_pw.hexEncode();
        // hash with token
        hashed_pw = sha256(hashed_token + hashed_pw);

        return hashed_pw;
    }

    async function setLoginData(e){ // pw 암호화 및 api data 받기
        let hashed_pw = await hashProcess();

        var response = await axios.post('/v1/auth', { // get api data
            userId: id,
            userPw: hashed_pw,
        }).catch((e)=>{
            const status = e.response.status;
            if(status==400){
                alert("아이디, 패스워드가 기입되었는지 다시 한 번 확인해주세요.");
            }else if(status==403){
                alert("아이디, 패스워드가 정확히 기입되었는지 다시 한 번 확인해주세요.");
            }else if(status==500){
                alert("내부 서버 오류입니다. 잠시만 기다려주세요.");
            }
        })

        window.location.href="/home";
    }

    function changeId(){
        const id = document.querySelector('#userId');
        setId(id.value);
    }

    function changePw(){
        const password = document.querySelector('#userPw');
        setPw(password.value);
    }
    
    /* rendering */

    return (
        <Grid className="Login">
            <Grid container alignItems="center" justifycontents="center" className="login_container" direction="column">
                <Typography variant="h5">로그인</Typography>
                <TextField variant="outlined" id="userId" label="id" required rows={1} rowsMax={10} onChange={changeId}></TextField>
                <TextField variant="outlined" id="userPw" label="password" type="password" required rows={1} rowsMax={10} onChange={changePw}></TextField>
                <Button onClick={setLoginData}>login</Button>
            </Grid>
        </Grid>
    );
}
export default Login