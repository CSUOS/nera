import React, { useState } from 'react';
import clsx from 'clsx';
import axios from "axios";
import { useHistory } from "react-router-dom";

import { Grid, Slide, Toolbar, IconButton, useScrollTrigger, Badge } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import MailIcon from '@material-ui/icons/Mail';
import CancelIcon from '@material-ui/icons/Cancel';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { useUserDispatch } from '../Main/Model/UserModel';
import { useOnOffState, useMessageState } from '../Main/Model/MessageModel';

type Props = {
	open: boolean;
	useOpen: React.Dispatch<boolean>;
	userName: string;
	userType: string;
}

const Header = ({ open, useOpen, userName, userType }: Props) => {
	const trigger = useScrollTrigger();
	const setUser = useUserDispatch();
	const history = useHistory();

	// alert 관련
	const [alertOpen, setAlertOpen] = useState<boolean>(false); // badge를 누를 때 alert가 3초간 오픈 되도록
	const [clearTime, setClearTime] = useState<NodeJS.Timeout | undefined>(undefined);
	const onOff = useOnOffState();
	const message = useMessageState();
	
	const onAlert = async () => {
		// 5초 후에 꺼짐
		await setAlertOpen(true);
		await setClearTime(setTimeout(() => setAlertOpen(false), 3000));
	};

	const handleOpenAlert = () => {
		useOpen(true)
	}

	const handleCloseAlert = async () => {
		// 수동으로 껐을 때, timeOut도 해지
		if (clearTime)
			await clearTimeout(clearTime);
		await setAlertOpen(false);
		await setClearTime(undefined);
	}

	const Logout = () => {
		const confirm = window.confirm("정말로 로그아웃 하시겠습니까?");

		if (confirm) {
			axios.post('/v1/logout', { withCredentials: true })
				.then(res => {
					setUser(undefined);
					history.push("/");
				})
				.catch(err => {
					alert("로그아웃을 할 수 없었습니다.");
					history.push("/");
				});
		}
	}

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			<Grid className={clsx(open ? "small-header" : "wide-header", "header")}>
				<Grid className="tool-bar">
					{
						!open &&
						<IconButton
							className="open-sidebar"
							aria-label="open drawer"
							onClick={handleOpenAlert}
							edge="start"
						>
							<MenuIcon />
						</IconButton>
					}
					<Grid className="header-menu-con">
						<Grid className="name-field"><p className="name">{userName}</p>{userType === 'professor' ? "교수" : ""}<p>님, 환영합니다.</p></Grid>
						<Grid className="right-side">
							{
								onOff &&
								<>
									<Badge id="badge" color="secondary" variant="dot" onClick={onAlert}>
										<MailIcon />
									</Badge>
									{
										alertOpen &&
											<Alert id="alert" severity="info">
												<AlertTitle className="title">
													공지사항
													<CancelIcon color="primary" onClick={handleCloseAlert} />
												</AlertTitle>
												<p className="info">{message}</p>
											</Alert>
									}
								</>
							}
							<Grid className="menu-field" onClick={Logout}>
								<ExitToAppIcon />
								<p>로그아웃</p>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Slide>
	);
}

export default Header;