import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { ListSubheader, Grid, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';

import { SortedAssignObj } from '../Main/Type';
import { useAssignmentState, useSelectedState } from '../Main/Model/AssignmentModel';
import { getColorState, getSortedAssign } from '../utils';

type MatchParams = {
	asId?: string;
}
type Props = RouteComponentProps<MatchParams> & {
	classes?: string
	useOpen: React.Dispatch<boolean>
	userType: string
}


const SideBar = ({ classes, useOpen, userType, match }: Props) => {
	const assignments = useAssignmentState();
	const selected = useSelectedState();
	const [sortedAssign, setSortedAssign] = useState<SortedAssignObj>([[], [], [], []]);
	const [nowOn, setNowOn] = useState<string>("main"); // main, assignment, setting, member 가 있고, 각 상태에 분기해서 현재 있는 위치 표시

	useEffect(() => {
		assignments &&
			setSortedAssign(getSortedAssign(assignments, userType));
	}, [assignments]);

	useEffect(() => {
		switch (window.location.pathname) {
		case "/main":
			// main 페이지
			setNowOn("main");
			break;
		case "/setting":
			setNowOn("setting");
			break;
		case "/member":
			setNowOn("member");
			break;
		default:
			setNowOn("assignment");
		}
	}, [window.location.href]);

	return (
		<Grid className={clsx(classes, "sidebar")}>
			<Grid className="sidebar-header">
				<Link className="logo-con" to="/main"><Grid className="NERA"><img src="/img/logo_new.png" /></Grid></Link>
				<IconButton onClick={() => useOpen(false)}><ArrowBackIcon /></IconButton>
			</Grid>
			<Grid className="contactTo">
				NERA에 대한 개선사항이 있다면<br />
				<a href="https://7tjqulsgu3s.typeform.com/to/SJywg6yt" target="blank">🐱이곳🐱</a>으로 알려주세요!
			</Grid>
			{
				sortedAssign &&
				sortedAssign.map((arr, index) => {
					const state = getColorState(index);
					return (
						<List
							key={index}
							className="assignment-list"
							subheader={
								<ListSubheader component="div" id="subheader">
									{userType === 'professor' ? state.professorState : state.studentState}
								</ListSubheader>
							}
						>{
								arr.map((as) =>
									<Link className="side-assign" key={as.assignmentId} to={`/as/${as.assignmentId}`}>
										<ListItem button>
											<FiberManualRecordIcon className={clsx("color", state.color)} />
											<ListItemText
												primary={as.assignmentName.length > 20 ?
													`${as.assignmentName.substring(0, 20)}...` : as.assignmentName}
											/>
											{
												// 현재 보고있는 page 표시
												nowOn === "assignment" && as.assignmentId === selected &&
												<p>✍🏼</p>
											}
										</ListItem>
									</Link>
								)
							}
						</List>
					);
				}
				)
			}
			{
				userType === 'professor' &&
				// 교수님 전용 메뉴
				<List
					subheader={
						<ListSubheader component="div" id="subheader" className="professor-menu">관리</ListSubheader>
					}
				>
					<Link className="side-assign" to='/setting'>
						<ListItem button>
							<ListItemText primary="과제 관리" />
							{
								// 현재 보고있는 page 표시
								nowOn === "setting" &&
								<p>✍🏼</p>
							}
						</ListItem>
					</Link>
					<Link className="side-assign" to='/member'>
						<ListItem button>
							<ListItemText primary="수강생 목록 관리" />
							{
								// 현재 보고있는 page 표시
								nowOn === "member" &&
								<p>✍🏼</p>
							}
						</ListItem>
					</Link>
				</List>
			}
		</Grid>
	);
}

export default withRouter(SideBar);