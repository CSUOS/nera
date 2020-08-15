import React, { useState } from 'react';
import axios from "axios";
import { Grid, TextField, Button, Typography } from '@material-ui/core';
import crypto from 'crypto';

// 로컬에서 디버그할 땐 서버를 3000에 실행시킨 다음,
// 프론트를 3001에서 실행시킨다.
// 그 후 아래 변수를 http://localhost:3000로 설정한다.
// 로컬에서 디버그하는 상황 외에는 실제 서버 주소로 설정해야 한다.
const SERVER_ADDR = "http://localhost:3000"

function Login(){
    // id, password
    const [id,setId]= useState("");
    const [pw,setPw]= useState("");

    // 아래의 함수는 digest("hex")로 대체되었습니다. hashData 함수를 확인해주세요!
    /*String.prototype.hexEncode = function(){ // string to hex code
        var hex, i;
    
        var result = "";
        for (i=0; i<this.length; i++) {
            hex = this.charCodeAt(i).toString(16);
            result += ("000"+hex).slice(-4);
        }
    
        return result
    }*/

    function hashData(data) {
        return crypto.createHash("sha256")
            .update(Buffer.from(data, "utf8").toString('base64'))
            .digest("hex");
    }

    async function hashProcess(){
        try {
            let hashed_token = await axios.get(SERVER_ADDR+'/v1/token', {}, { withCredentials: true });

            if (hashed_token.status == 404) {
                alert("내부 서버 오류로 token을 찾을 수 없습니다. 로그인을 다시 시도해주세요.");
                return;
            }
            // hash password
            let hashed_pw = hashData(hashData(pw));
            // hash result
            let result = hashData(hashed_token + hashed_pw);

            return result;
        } catch (err) {
            alert("예기치 못한 오류가 발생하였습니다.\n추가 정보: " + err);
        }
        
    }

    async function setLoginData(e){ // pw 암호화 및 api data 받기
        let hashed_pw = await hashProcess();
        var response = await axios.post(SERVER_ADDR + '/v1/login', { // get api data
            userId: id,
            userPw: hashed_pw,
        }, { withCredentials: true }).catch((err)=>alert("예기치 못한 오류가 발생하였습니다.\n추가 정보: " + err));

        console.log(response);

        const status = response.status;
        const rabumsStatus = response?.data?.message?.slice(response.data.message.length - 3);

        if(status==400 || rabumsStatus == "400"){
            alert("아이디, 패스워드가 기입되었는지 다시 한 번 확인해주세요.");
        }else if(status==403 || rabumsStatus == "403"){
            alert("아이디, 패스워드가 정확히 기입되었는지 다시 한 번 확인해주세요.");
        }else if(status==500 || rabumsStatus == "500"){
            alert("내부 서버 오류입니다. 잠시만 기다려주세요.");
        }

        if (status === 200 && rabumsStatus == undefined) {
            //window.location.href = "/home";
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
    async function cookieTest(e){
        
        let cookie = await axios.get(SERVER_ADDR+'/cookieTest/', {}, {credentials : true});
        console.log(cookie);
    }

    async function loginAsTestAccount(e) {

        let hashed_token = await axios.get(
                            SERVER_ADDR+'/v1/token', {}, { credentials: true }
                            ).catch((err)=>console.log(err));

        if (hashed_token.status == 404) {
            alert("내부 서버 오류로 token을 찾을 수 없습니다. 로그인을 다시 시도해주세요.");
            return;
        }

        /*let response = await axios.post(SERVER_ADDR+'/v1/login', { // get api data
            userId: "train96",
            userPw: hashData(hashed_token.data + "962d3b4a8f231a9d9902619e1775648ee8db3ac90966ad013a27bdfa24940f93"),
        }, { credentials: true }).catch((err)=>alert("예기치 못한 오류가 발생하였습니다.\n추가 정보: " + err));*/
        let response = await axios.get(SERVER_ADDR+'/v1/cookieTest', { withCredentials: true }).
            catch((err) => alert("예기치 못한 오류가 발생하였습니다.\n추가 정보: " + err));
        const status = response.status;
        const rabumsStatus = response?.data?.message?.slice(response.data.message.length - 3);
        if(status==400 || rabumsStatus == "400"){
            alert("아이디, 패스워드가 기입되었는지 다시 한 번 확인해주세요.");
        }else if(status==403 || rabumsStatus == "403"){
            alert("아이디, 패스워드가 정확히 기입되었는지 다시 한 번 확인해주세요.");
        }else if(status==500 || rabumsStatus == "500"){
            alert("내부 서버 오류입니다. 잠시만 기다려주세요.");
        }
        console.log(response.data);
        if (status == 200 && rabumsStatus == undefined) {
           window.location.href = "/home";
           console.log(response);
        }
    }
    
    /* rendering */

    return (
        <Grid className="Login">
            <Grid container alignItems="center" justifycontents="center" className="login_container" direction="column">
                <Typography variant="h5">로그인</Typography>
                <TextField variant="outlined" id="userId" label="id" required rows={1} rowsMax={10} onChange={changeId}></TextField>
                <TextField variant="outlined" id="userPw" label="password" type="password" required rows={1} rowsMax={10} onChange={changePw}></TextField>
                <Button onClick={setLoginData}>login</Button>
                <Button onClick={cookieTest}>debug</Button>
            </Grid>
        </Grid>
    );
}
export default Login