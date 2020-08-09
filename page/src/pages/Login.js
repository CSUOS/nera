import React, { useState, useEffect } from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';
import { Grid, TextField, Button, Typography } from '@material-ui/core';

function Login(){
    // id, password
    const [id,setId]= useState();
    const [pw,setPw]= useState();
    
    async function sendLoginData(e){
        const sha256 = require('sha256');
        const secret = process.env.REACT_APP_SECRET;
        const hashed_pw = sha256(pw + secret);
        console.log(secret);
        
        await axios.post('/v1/auth', {
            userId: id,
            userPw: hashed_pw,
          }).then((response) => {
            console.log(response);
          }
        );
    }

    function changeId(){
        const id = document.querySelector('#userId');
        setId(id.value);
    }

    function changePw(){
        const password = document.querySelector('#userPw');
        setPw(password.value);
    }
    

    let name = ""; let major = ""; let user_number = -1; let meta = {"create_at":Date(),"modified_at":Date()};

    // before rendering
    
    // 로그인 api 
    name = "우희은";
    user_number = 2017920038;
    meta["create_at"]="2020-08-03T01:09:49.742Z";
    meta["modified_at"]="2020-08-03T01:09:49.742Z";
    
    // major 계산
    let major_number = user_number.toString().substring(4,7);
    switch(major_number){
        case "920":
            major = "컴퓨터과학부";
            break;
        default:
            major = "~~~~부";
            break;
    }

    useEffect(()=>{

    });

    const path_name = "/home";
    return (
        <Grid className="Login">
            <form method="post" onClick={sendLoginData}>
                <Grid container alignItems="center" justifycontents="center" className="login_container" direction="column">
                    <Typography variant="h5">로그인</Typography>
                    <TextField variant="outlined" id="userId" label="id" required rows={1} rowsMax={10} onChange={changeId}></TextField>
                    <TextField variant="outlined" id="userPw" label="password" type="password" required rows={1} rowsMax={10} onChange={changePw}></TextField>
                    
                    <Link to={{
                        pathname:path_name,
                        state:{
                            // 로그인 시 회원인증 서버에서 넘어오는 정보 넘기기
                            name: name,
                            major: major,
                            user_number: user_number,
                            meta: meta,
                        }
                    }}>
                        <Button>login</Button>
                    </Link>
                </Grid>
            </form>
        </Grid>
    );
}
export default Login