import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
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

    function hashProcess(){
        const sha256 = require('sha256');
        const hashed_token = 'hi'; // api로 받기

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
        try{
            let hashed_pw = await hashProcess();

            if(hashed_pw){
                var response = await axios.post('/v1/auth', { // get api data
                    userId: id,
                    userPw: hashed_pw,
                }).catch((e)=>{
                    console.log(e);
                })

                //if(response.status===200)
                    //window.location.href="/home";
            }

        }catch(e){
            // error 처리 하기
            console.log(e);
        }
    }

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