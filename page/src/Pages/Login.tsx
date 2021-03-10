import React, { useEffect, useState } from 'react';
import axios from "axios";
import crypto from 'crypto';
import { useHistory } from "react-router-dom";
import { withCookies, Cookies } from 'react-cookie';

import { Grid, TextField, Button, InputAdornment, Paper, Checkbox, FormControlLabel, Divider, hslToRgb } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';

import { getHashedPw, getUserInfo } from '../utils';
import { useUserState, useUserDispatch } from '../Main/Model/UserModel';
import { useAssignmentDispatch } from '../Main/Model/AssignmentModel';

type Props = {
	cookies: Cookies;
}
const Login: React.FunctionComponent<Props> = (props) => {
	const [cookies, setCookies] = useState<any>(props.cookies);
	const [id, setId] = useState<string>("");
	const [pw, setPw] = useState<string>("");
	const [btnText, setBtnText] = useState<string>("LOGIN");
	const [checked, setChecked] = useState<boolean>(false);
	const history = useHistory();
	const user = useUserState();
	const setUser = useUserDispatch(); // dispatch => setUser
	const asDispatch = useAssignmentDispatch();

	useEffect(() => {
		// 이미 user가 설정되어있으면 main으로
		user && history.replace('/main');
	}, [user]);

	useEffect(() => {
		// cookie에 저장되어있는 아이디 불러오기 (자동 로그인)
		if (cookies) {
			const savedId = cookies.get("savedId");
			if (savedId) {
				setId(String(savedId));
				setChecked(true);
			}
		} else {
			setCookies(props.cookies);
		}
	}, [props.cookies]);

	const loginAsTestProfessorCookie = async () => {
		try {
			const result = await axios.get('/v1/cookieTest', { withCredentials: true });
			if (result.status === 200) {
				setUser(getUserInfo());
				history.replace('/main');
			}
		} catch (err) {
			alert("내부 서버 오류입니다. 잠시만 기다려주세요.");
		}
	};

	const loginAsTestStudentCookie = async () => {
		try {
			const result = await axios.get('/v1/cookieTestB', { withCredentials: true });
			if (result.status === 200) {
				setUser(getUserInfo());
				history.replace('/main');
			}
		} catch (err) {
			alert("내부 서버 오류입니다. 잠시만 기다려주세요.");
		}
	};

	const handleLoginSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setBtnText("로그인 중...");
		const hashedPw = getHashedPw(pw);

		try {
			const result = await axios.post('/v1/login', {
				userId: id,
				userPw: hashedPw,
			}, { withCredentials: true });

			if (result) {
				// set the cookie if user checked save id
				checked ? cookies.set("savedId", id, { path: '/' }) : cookies.remove("savedId", { path: '/' });
				const u = getUserInfo();
				if (u) { // cookie에 유저 존재
					setUser(u);
				}
				history.replace('/main');

				/*
				user setting되면 자동으로 useEffect 호출됨
				// set assignment when user login
				asDispatch({
					type: 'FETCH'
				});
				*/
			}
		} catch (err) {
			const { status } = err.response;
			if (!status) {
				alert("로그인 하는 중 예기치 못한 예외가 발생하였습니다.\n" + JSON.stringify(err));
			}
			else if (status === 400) {
				alert("아이디, 패스워드가 기입되었는지 다시 한 번 확인해주세요.");
			}
			else if (status === 403) {
				alert("아이디, 패스워드가 정확히 기입되었는지 다시 한 번 확인해주세요.");
			}
			else if (status >= 500) {
				alert("내부 서버 오류입니다. 잠시만 기다려주세요.");
			}
			setBtnText('Login');
		}
	}

	return (
		<div className="Login">
			<Paper elevation={3} className="login-paper">
				<Grid className="login-container">
					<Grid className="login-info">
						<img src="./img/logo_new.png" />
						<h6>서울시립대학교 컴퓨터과학부 과제 제출 플랫폼</h6>
					</Grid>
					<Grid className="login-form-con">
						<p>*Rabums 계정으로 로그인하세요.</p>
						<TextField
							id="userId"
							variant="outlined"
							required
							rows={1} rowsMax={10}
							value={id}
							onChange={(e) => setId(e.target.value)}
							color="primary"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<AccountCircle />
									</InputAdornment>
								),
							}}
							placeholder="Rabums ID"
						/>
						<TextField
							id="userPw"
							type="password"
							variant="outlined"
							required
							rows={1} rowsMax={10}
							value={pw}
							onChange={(e) => setPw(e.target.value)}
							color="primary"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<LockIcon />
									</InputAdornment>
								),
							}}
							placeholder="Rabums PassWord"
						/>
						<Grid className="form-sub-con">
							<FormControlLabel
								control={
									<Checkbox checked={checked} color="primary" onChange={(e) => { setChecked(e.target.checked) }}></Checkbox>
								}
								label="아이디 저장"
							/>
							<a href="https://rabums.csuos.ml" target="blank">Rabums 계정이 없나요?</a>
						</Grid>
						<Button className="login-btn" variant="contained" color="primary">로그인</Button>
					</Grid>
					<Grid className="login-test-con">
						<h6>로그인하지 않고도 서비스를 체험할 수 있습니다.</h6>
						<Grid container justify="center">
							<Button className="login-test" variant="outlined" onClick={loginAsTestProfessorCookie}>교수 계정 체험</Button>
							<Button className="login-test" variant="outlined" onClick={loginAsTestStudentCookie}>학생 계정 체험</Button>
						</Grid>
					</Grid>
				</Grid>
			</Paper>
		</div>
	)
};

export default withCookies(Login);
