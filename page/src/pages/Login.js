import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Typography, Paper, Link, Checkbox, FormControlLabel, Divider } from '@material-ui/core';
import { getUserInfo } from "../function/GetUserInfo";

import axios from "axios";
import crypto from 'crypto';
import { useHistory } from "react-router-dom";
import { withCookies } from 'react-cookie';

function Login(props){
    // id, password
    const [cookies, setCookies] = useState(props.cookies);
    const [id,setId]= useState("");
    const [pw,setPw]= useState("");
    const [buttonText, setButtonText] = useState("Login");
    const [checked, setChecked] = useState(false);
    const history = useHistory();

    function isAlreadyLoggedIn() {
        try {
            getUserInfo();
        } catch (err) {
            return false;
        }
        return true;
    }

    useEffect(() => {
        if (isAlreadyLoggedIn())
            history.replace('/home');

        if (cookies) {
            let savedId = cookies.get("savedId");
            if (savedId) {
                setId(String(savedId));
                setChecked(true);
            }
        } else {
            setCookies(props.cookies);
        }
    }, [props.cookies]);

    function hashData(data) {
        return crypto.createHash("sha256")
            .update(Buffer.from(data, "utf8").toString('base64'))
            .digest("hex");
    }

    function redirectToHome() {
        if (checked)
            cookies.set("savedId", id, { path: '/' });
        else
            cookies.remove("savedId", { path: '/' });

        
        history.replace("/home");
    }

    async function hashProcess(){
        try {
            let hashed_token = await axios.get('/v1/token', { withCredentials: true });

            if (hashed_token.status === 404) {
                alert("내부 서버 오류로 token을 찾을 수 없습니다. 로그인을 다시 시도해주세요.");
                return;
            }
            // hash password
            let hashed_pw = hashData(hashData(pw));
            // hash result
            let result = hashData(hashed_token.data + hashed_pw);

            return result;
        } catch (err) {
            alert("예기치 못한 오류가 발생하였습니다.\n추가 정보: " + err);
        }
        
    }

    async function setLoginData(e) { // pw 암호화 및 api data 받기
        setButtonText("로그인 중...");
        let hashed_pw = await hashProcess();
        await axios.post('/v1/login', { // get api data
            userId: id,
            userPw: hashed_pw,
        }, { withCredentials: true })
            .then(() => {
                redirectToHome();
            })
            .catch((err) => {
                const status = err?.response?.status;
                if (status === undefined) {
                    alert("로그인 하는 중 예기치 못한 예외가 발생하였습니다.\n" + JSON.stringify(err));
                }
                else if (status === 400) {
                    alert("아이디, 패스워드가 기입되었는지 다시 한 번 확인해주세요.");
                }else if (status === 403) {
                    alert("아이디, 패스워드가 정확히 기입되었는지 다시 한 번 확인해주세요.");
                }else if (status === 500) {
                    alert("내부 서버 오류입니다. 잠시만 기다려주세요.");
                }

                setButtonText("Login");
            });
    }

    function changeId(event){
        setId(event.target.value);
    }

    function changePw(event){
        setPw(event.target.value);
    }

    async function loginAsTestProfessorCookie(e) {
        setButtonText("로그인 중...");

        let hashed_token = await axios.get(
                            '/v1/token', { withCredentials: true }
                            ).catch((err)=>console.log(err));

        if (hashed_token.status === 404) {
            alert("내부 서버 오류로 token을 찾을 수 없습니다. 로그인을 다시 시도해주세요.");
            return;
        }

        let response = await axios.get('/v1/cookieTest', { withCredentials: true }).
            catch((err) => alert("예기치 못한 오류가 발생하였습니다.\n추가 정보: " + err));
        const status = response.status;
        const rabumsStatus = response?.data?.message?.slice(response.data.message.length - 3);
        if(status===400 || rabumsStatus === "400"){
            alert("아이디, 패스워드가 기입되었는지 다시 한 번 확인해주세요.");
        }else if(status===403 || rabumsStatus === "403"){
            alert("아이디, 패스워드가 정확히 기입되었는지 다시 한 번 확인해주세요.");
        }else if(status===500 || rabumsStatus === "500"){
            alert("내부 서버 오류입니다. 잠시만 기다려주세요.");
        } else if (status === 200 && rabumsStatus === undefined) {
            redirectToHome();
        } else {
            setButtonText("Login");
        }
    }
    async function loginAsTestStudentCookie(e) {
        setButtonText("로그인 중...");

        let hashed_token = await axios.get(
                            '/v1/token', { withCredentials: true }
                            ).catch((err)=>console.log(err));

        if (hashed_token.status === 404) {
            alert("내부 서버 오류로 token을 찾을 수 없습니다. 로그인을 다시 시도해주세요.");
            return;
        }

        let response = await axios.get('/v1/cookieTestB', { withCredentials: true }).
            catch((err) => alert("예기치 못한 오류가 발생하였습니다.\n추가 정보: " + err));
        const status = response.status;
        const rabumsStatus = response?.data?.message?.slice(response.data.message.length - 3);
        if(status===400 || rabumsStatus === "400"){
            alert("아이디, 패스워드가 기입되었는지 다시 한 번 확인해주세요.");
        }else if(status===401 || rabumsStatus === "401"){
            alert("토큰 없음");
        }
        else if(status===403 || rabumsStatus === "403"){
            alert("아이디, 패스워드가 정확히 기입되었는지 다시 한 번 확인해주세요.");
        }else if(status===500 || rabumsStatus === "500"){
            alert("내부 서버 오류입니다. 잠시만 기다려주세요.");
        }else if (status === 200 && rabumsStatus === undefined) {
            redirectToHome();
        }else {
            setButtonText("Login");
        }
    }

    function handleCheckboxChange(event) {
        setChecked(event.target.checked);
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            setLoginData(undefined);
            event.preventDefault();
        }
    }

    /* rendering */

    return (
        <div className="Login">
            <Paper elevation={3} className="login_paper">
                <Grid container alignItems="center" justifycontents="center" className="login_container" direction="column">
                    <img className="login_logo" src="./img/logo1_1.png"></img>
                    <Typography className="login_subtitle" variant="caption">서울시립대학교 컴퓨터과학부 과제 제출 플랫폼</Typography>

                    <div className="login_sign">
                        <Link href="https://rabums.csuos.ml/">RABUMS</Link>
                        <Typography variant="subtitle1">계정으로 로그인하세요.</Typography>
                    </div>
                    <TextField variant="outlined" id="userId" label="RABUMS ID" required rows={1} rowsMax={10} onChange={changeId} onKeyPress={handleKeyPress} value={id}></TextField>
                    <TextField variant="outlined" id="userPw" label="RABUMS PW" type="password" required rows={1} rowsMax={10} onChange={changePw} onKeyPress={handleKeyPress} value={pw}></TextField>
                    <FormControlLabel control={
                            <Checkbox checked={checked} onChange={handleCheckboxChange} color="secondary"></Checkbox>
                        }
                        label="아이디 저장"
                    />

                    <div className="regiter_sign">
                        <Link href="https://rabums.csuos.ml/register">RABUMS 계정이 없으신가요?</Link>
                    </div>
                    <Button className="login_button" size="large" variant="outlined" onClick={setLoginData}>{buttonText}</Button>

                    <div className="login_divider">
                        <Divider orientation="horizontal" variant="middle"></Divider>
                    </div>

                    <Typography variant="subtitle2">회원가입하지 않고 체험용 계정으로 로그인할 수 있습니다!</Typography>
                    
                    <Grid orientation="row">
                        <Button className="login_test" variant="outlined" onClick={loginAsTestProfessorCookie}>교수 계정 체험</Button>
                        <Button className="login_test" variant="outlined" onClick={loginAsTestStudentCookie}>학생 계정 체험</Button>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
export default withCookies(Login);