import React from 'react';
import { Link, useHistory } from "react-router-dom";

import { PageInfo } from '../Components';
import { useAssignmentState, useDeleteAssignment } from '../Main/Model/AssignmentModel';
import { AssignmentObj } from '../Main/Type'
import { assignmentStateConst } from '../utils/assignmentStateConst'

import { Grid, Paper, Button, Typography } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { green } from '@material-ui/core/colors';

const Setting: React.FC = () => {
	const assignment = useAssignmentState();
	const confirmDeletion = useDeleteAssignment();
	const history = useHistory();
    
	function deleteAssignment(id: number, name: string){
		const string = "과제 \""+name+"\" 을(를) 정말로 삭제할까요?";
		if(window.confirm(string)===false){
			return;
		}

		confirmDeletion(id);
		history.push("/setting");
	}

	function getAssignmentBox(as: AssignmentObj) {
		let stateWord = "error";

		switch(as.assignmentState){
		case assignmentStateConst["notReleased"]: 
			stateWord="발행 전"; 
			break;
		case assignmentStateConst["released"]: 
			stateWord="발행됨"; 
			break;
		case assignmentStateConst["scoring"]: 
			stateWord="채점 필요"; 
			break;
		case assignmentStateConst["done"]: 
			stateWord="채점 완료"; 
			break;
		default: 
			return;
		}

		let icon = <FiberManualRecordIcon className="circle_icon"/>
		switch(as.assignmentState){
		case assignmentStateConst["notReleased"]:
			icon = <FiberManualRecordIcon/>;
			break;
		case assignmentStateConst["released"]:
			icon = <FiberManualRecordIcon style={{color:green[700]}}/>;
			break;
		case assignmentStateConst["scoring"]:
			icon = <FiberManualRecordIcon color="secondary"/>;
			break;
		case assignmentStateConst["done"]:
			icon = <FiberManualRecordIcon color="primary"/>;
			break;
		default: 
			return;
		}

		return(
			<div className="box-container">
				<Paper elevation={3} className="box-button">
					<div onClick={() => history.push("/setting/" + as.assignmentId)} className="box-name">
						{icon}
						<Typography>
							{as.assignmentName} ({stateWord})
						</Typography>
					</div>
					<div className="box-xbtn">
						<Button onClick={()=>deleteAssignment(as.assignmentId, as.assignmentName)}><ClearIcon/></Button>
					</div>
				</Paper>
			</div>
		);
	}

	return(
		<Grid container className="setting-con" direction="column">
			<PageInfo className="assignment_info"
				icon="📖"
				mainTitle="과제관리"
				subTitle="사용자의 과제 목록을 볼 수 있는 페이지입니다."
				information={<p>각 과제의 세부 정보를 수정하시려면 과제명을 클릭하세요. 과제를 추가하시려면 &apos;과제 추가하기&apos; 버튼을 눌러주세요.</p>}
			/>
			<div className="contents-container">
				<div className="contents-title">
					<h6>과제 목록</h6>
					<Button color="primary" variant="contained" onClick={() => history.push("/setting/add")}>과제 추가하기</Button>
				</div>
				<div className="contents box-layout">
					{
						assignment.length === 0 ? (
							<Grid item>
								<Typography variant="h6">과제가 없습니다. 추가해주세요!</Typography>
							</Grid>
						) : (
							assignment.map((as)=> getAssignmentBox(as))
						)
					}
				</div>
			</div>
		</Grid>
	);
}

export default Setting;