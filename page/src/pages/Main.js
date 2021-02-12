import React, { useState, useEffect } from 'react';
import { SideBar, Header, Loading } from "../components";
import { Home, Assignment, Setting, SetAssignment, Scoring, SetStudentList } from "../pages";
import { getUserInfo } from "../function/GetUserInfo";

import clsx from 'clsx';
import axios from "axios";

import { Grid, Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Route, useHistory } from "react-router-dom";

/* style definition => 대부분 css로 옮길 예정 */

const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({
	appBar: {
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}
}));


/* main pages */
function Main(props) {
	/* drawer 코드 */
	const classes = useStyles();
	const [open, setOpen] = useState(true); // header와 drawer에 동시 적용되어야하기 때문에 Main에 저장
	const [user, setUser] = useState(undefined);
	const [sideAssign, setSideAssign] = useState(undefined);
	const history = useHistory();

	const handleDrawerOpen = () => {
		setOpen(true);
	};
  
	const handleDrawerClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		try{
			setUser(getUserInfo());
		}catch(err){
			history.push("/");
		}
		setSideBarAssignment();
	}, []);

	function setSideBarAssignment(){
		axios.get('/v1/assignment', { withCredentials: true })
			.then(res => {
				let assign = res.data;
				let sAssign = [];
				for (let i = 0; i < assign.length; i++) {
					// id: 0, title : 1, state : 2
					sAssign.push(
						[
							assign[i].assignmentId,
							assign[i].assignmentName,
							assign[i].assignmentState
						]);
				}

				setSideAssign(sAssign);
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("과제 정보를 얻는 중 예기치 못한 예외가 발생하였습니다. (Main.js)\n" + JSON.stringify(err));
				}
				else if (status === 400) {
					alert(`과제 정보를 얻는데 실패하였습니다. 잘못된 요청입니다. (${status})`);
				}
				else if (status === 401) {
					alert(`토큰이 유효하지 않습니다. (${status})`);
					document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
					history.push("/");
				}
				else if (status === 404) {
					alert("과제를 찾을 수 없습니다.");
				}
				else if (status === 500) {
					alert("내부 서버 오류입니다. 잠시 후에 다시 시도해주세요...");
				}
				setSideAssign([]);
			})
	}

	/* rendering */
	if (user === undefined || sideAssign === undefined)
		return (
			<Loading status="불러오는 중..."></Loading>
		);
	else
		return (
			<Grid container direction="column">
				{user === undefined || sideAssign === undefined ?
					<Loading status="과제 정보를 가져오는 중..."></Loading>
					:
					<React.Fragment>
						<Grid item>
							<Header
								drawerOpen={handleDrawerOpen}
								open={open}
								type={user.type}
								name={user.userName}
							/>
						</Grid>
						<Grid container item className="drawer_height">
							<Grid item>
								<Drawer
									className={classes.drawer+ " drawer_con"}
									variant="persistent"
									anchor="left"
									open={open}
									classes={{
										paper: classes.drawerPaper,
									}}
								>
									<SideBar
										type={user.type}
										drawerClose={handleDrawerClose}
										assignmentInfo={sideAssign}
									/>
								</Drawer>
							</Grid>

							<Grid
								className={clsx(classes.content,
									classes.appBarShift,
									{
										[classes.contentShift]: open,
									}, "margin-top-64", "contents_side")}
							>
								<Route exact path="/home" component={Home} />
								<Route exact path="/home/assignment/:asId" 
									render={user.type === 1 ? 
										({match}) => <Assignment match={match}></Assignment> : 
										({match}) => <Scoring match={match} onUpdate={setSideBarAssignment}></Scoring>} 
								/>
								<Route exact path="/home/setting" component={Setting} />
								<Route exact path="/home/setting/:asId" component={SetAssignment} />
								<Route exact path="/home/setList" component={SetStudentList} />
							</Grid>

						</Grid>
					</React.Fragment>}
			</Grid>
		)
}

export default Main