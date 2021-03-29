import React, { Dispatch, useEffect, useState } from 'react';

import { Grid, Paper, Button, Typography } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

import { PageInfo, StudentPopup } from '../Components';
import { GroupObj } from '../Main/Type';
import { useGroupState, useDeleteGroup } from '../Main/Model/GroupModel';

// SetMember 페이지
const SetMember = () => {
	const groups : Array<GroupObj> = useGroupState();
	const deleteGroupFunc : (groupId : number) => void = useDeleteGroup();

	// 처음 modal을 초기화하는 정보
	const [selected, setSelected] = useState<GroupObj | undefined>(undefined); 
	const [open, setOpen] = useState<boolean>(false);

	const setGroup = async (id : number) => {
		// 클릭 시 selected에 group 세팅
		// await setSelected(undefined);
		await groups.forEach((gr) => {
			if(gr.groupId === id)
				setSelected(gr);
		});
		setOpen(true);
	}

	const addGroup = async () => {
		await setSelected(undefined);
		await setOpen(false); // open을 갱신하므로써 modal을 띄우기
		setOpen(true);
	}

	const deleteGroup = (groupId : number, className : string) => {
		if(confirm(`[${className}] 그룹을 정말로 삭제하시겠어요?`))
			deleteGroupFunc(groupId);
	}

	return (
		<Grid container className="setmember-con" direction="column">
			<PageInfo className="student-list-info"
				icon="🙌🏻"
				mainTitle="수강생 목록 관리"
				subTitle="수강생 목록을 추가 / 수정 하는 페이지 입니다." 
				information={<p>수강생 목록의 세부 정보를 수정하시려면 수강생 목록명을 클릭하세요. 수강생 목록을 추가하시려면 &apos;수강생 목록 추가하기&apos; 버튼을 눌러주세요.</p>}
			/>
			<div className="contents-container">
				<div className="contents-title">
					<h6>수강생 목록</h6>
					<Button color="primary" variant="contained" onClick={addGroup}>수강생 목록 추가하기</Button>
				</div>
				<div className="contents box-layout" >
					{
						groups.length===0?
							<div>
								<Typography variant="h6">수강생 목록이 없습니다. 생성해주세요!</Typography>
							</div>
							:groups.map((gr)=>(
								<div key={gr.groupId} className="box-container">
									<Paper elevation={3} className="box-button">
										<div onClick={() => setGroup(gr.groupId)} className="box-name">
											{gr.className.length > 30 ?
												`${gr.className.substring(0, 30)}...` : gr.className}
										</div>
										<div className="box-xbtn">
											<Button onClick={()=> deleteGroup(gr.groupId, gr.className)}>
												<ClearIcon/>
											</Button>
										</div>
									</Paper>
								</div>
							))
					}
				</div>
			</div>
			{
				<StudentPopup
					open = {open}
					typeProps = { selected ? 'update' : 'add' }
					handleClose = {() => setOpen(false)}
					groupProps = { selected }
				/>
			}
		</Grid>
	);
}

export default SetMember;
