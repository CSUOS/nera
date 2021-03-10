import React, { Dispatch, useEffect, useState, KeyboardEvent, createRef } from 'react';
import XLSX from 'xlsx';

import { Grid, Modal, Paper, TextField, Button, Typography, Tooltip } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close';

import { GroupObj } from '../Main/Type';
import { useGroupState, useSaveGroup } from '../Main/Model/GroupModel';
import { useUserState } from '../Main/Model/UserModel';

const typeString = ['add', 'update', 'use'];

type MemberObject = {
	open: boolean;
	typeProps: typeof typeString[number];
	groupProps?: GroupObj;
	handleClose: () => void;
	setStudents?: Dispatch<Array<number>>;
}

const StudentPopup = ({ open, typeProps, groupProps, handleClose, setStudents }: MemberObject) => {
	const groups = useGroupState(); // model에서 group 정보 받아오기
	const user = useUserState();
	const saveGroupFunc = useSaveGroup();
	const nameRef = createRef<HTMLInputElement>();

	const [update, forceUpdate] = useState<boolean>(true);
	const [group, setGroup] = useState<GroupObj | undefined>(groupProps); // 그룹 이름으로 받아올 시에 저장되는 변수

	const [name, setName] = useState<string>(""); // 현재 MODAL에 있는 리스트 이름
	const [members, setMembers] = useState<Array<string>>([]); // 현재 MODAL에 있는 수강생 리스트
	const [openGroups, setOpenGroups] = useState<boolean>(false); // 기존 그룹 보여주기 여부
	const [openImg, setOpenImg] = useState<boolean>(false); // excel 설명 이미지

	useEffect(() => {
		// 그룹이 바뀌면 member도 다시 세팅
		const setMembersByGroup = async () => {
			setMembers([]); setName("");
			if (group === undefined) {
				return;
			}

			const tmp = members.slice(0);
			await group.students.forEach((student) => {
				tmp.push(student.toString());
			});
			await setMembers(tmp);
			await setName(group.className);
		}

		setMembersByGroup();
	}, [group]);

	const changeMember = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
		// textfield가 바뀔 때마다 members 갱신
		const tmp = members; // 얕은 복사
		tmp[index] = e.target.value;
		await setMembers(tmp);
		forceUpdate(!update);
	}

	const addMember = () => {
		// member 추가
		setMembers([
			...members,
			""
		]);
	}

	const deleteMember = async (index: number) => {
		// member 삭제
		await setMembers([]);
		const tmp = members;
		tmp.splice(index, 1);
		await setMembers(tmp);
	}

	const changeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		// 이름은 길이가 max 30
		if (e.target.value.length > 30) {
			alert("수강생 목록의 이름은 30자를 초과할 수 없습니다.");
			return;
		}
		setName(e.target.value);
	}

	const changeGroup = async (gr: GroupObj) => {
		// 수강생 목록 불러오기에서 목록 클릭 시
		await setGroup(undefined);
		await setGroup(gr);
	}

	const uploadXlsxFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log("엑셀 파일 로드");
		const file = e.target.files && e.target.files[0];
		if (file === null) return;

		// 확장자 검사
		const name = file.name.slice(0, file.name.indexOf(".")).toLowerCase();
		const check = file.name.slice(file.name.indexOf(".") + 1).toLowerCase();
		if (check !== 'csv' && check !== 'xlsx') {
			alert('.csv, .xlsx 파일만 등록 가능합니다.');
			return;
		}

		try {
			const reader = new FileReader();
			reader.onload = async (evt) => { // evt = on_file_select event
				/* Parse data */
				const bstr = evt.target && evt.target.result;
				const wb = XLSX.read(bstr, { type: 'binary' });
				/* Get first worksheet */
				const wsname = wb.SheetNames[0];
				const ws = wb.Sheets[wsname];
				/* Convert array of arrays */
				const data = XLSX.utils.sheet_to_json<any>(ws);

				/* Update state => 기존 멤버에 추가 */
				const tmp: Array<string> = [];
				data.forEach(element => {
					tmp.push(element['학번'].toString().trim());
				});
				await setName(name);
				await setMembers(tmp);
			};
			reader.readAsBinaryString(file);
		} catch (e) {
			alert("엑셀 파일을 로딩하는 중 오류가 발생했습니다.");
			return;
		}
	}

	const isCorrect = (member: string) => {
		// 입력한 학번 검사
		if (isNaN(Number(member))) { // 숫자로 변환 가능
			return false;
		}
		if (Number(member) >= 3000000000 || Number(member) <= 2000000000) { // 범위 체크
			return false;
		}
		return true;
	}

	const saveGroup = async () => {
		// 수강생 목록 이름이 없으면 focus, alert
		if (name === "") {
			alert("수강생 목록 이름이 입력되지 않았습니다.");
			nameRef.current &&
				nameRef.current.focus();
			return;
		}

		let flag = 0;
		// 비어있는 칸 없애버리기, 중복된 학번 지우기
		const saveMembers = members.filter((member, index) => {
			return(
				member !== "" && members.indexOf(member) === index
			)
		});

		// 학번이 하나도 없으면 return
		if (saveMembers.length === 0) {
			alert("학번을 하나 이상 입력해주세요.");
			return;
		}

		await saveMembers.forEach((member, index) => {
			// 학번 검사
			if (!isCorrect(member)) {
				alert("학번을 제대로 입력해주세요.");
				flag = 1;
				return;
			}
		});

		// 학번이 제대로 되어있지 않은 칸이 있으면 return
		if (flag)
			return;

		// use일 때는 student 돌려주고 끝
		if(typeProps === 'use' && setStudents){
			setStudents(saveMembers.map((member) => parseInt(member)));
			await handleClose();
			return;
		}

		user &&
			saveGroupFunc({
				className: name,
				students: saveMembers.map((member) => parseInt(member)),
				groupId: (typeProps === 'add' || group === undefined) ? -1 : group.groupId // 생성은 -1
			})
		await handleClose();
	}

	const setMemberByKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
		// keyboard 눌림에 따라 member 삭제 및 생성
		switch (e.keyCode) {
		case 13: // enter
			addMember();
			break;
		case 46: // delete
			deleteMember(index);
		}
	}

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="student-modal"
			aria-describedby="수강생 목록 모달입니다."
			className="modal">
			<Paper elevation={3} className="modal-con group-modal-con contents-container">
				<div>
					<div className="contents-title">
						<Grid>
							<h6>수강생 불러오기</h6>
							<Button className="x-btn x-btn1" variant="outlined" onClick={handleClose}><CloseIcon /></Button>
						</Grid>
						<Grid>
							<Button color="primary" variant="contained" onClick={() => setGroup(undefined)} className="init-btn">초기화</Button>
							<Button color="primary" variant="contained" onClick={saveGroup}>{typeProps === 'use' ? "과제에 등록" : "저장"}</Button>
							<Button className="x-btn x-btn2" variant="outlined" onClick={handleClose}><CloseIcon /></Button>
						</Grid>
					</div>
					<Grid className="get-group-con" container>
						<Grid container alignItems="center">
							<Grid className="group-btn-con" container alignItems="center">
								<Button color="secondary" variant="contained" onClick={() => setOpenGroups(!openGroups)}>{openGroups ? "기존 수강생 목록 숨기기" : "기존 수강생 목록 불러오기"}</Button>
								<p>{openGroups ? "👇 목록 이름을 클릭하면 수강생들을 불러올 수 있습니다." : "👈 버튼을 클릭하면 목록을 불러올 수 있습니다."}</p>
							</Grid>
							{
								// 기존에 존재하는 수강생 목록 불러오기
								openGroups &&
								<Grid className="group-con" container alignItems="center" wrap="wrap">
									{groups.map((gr) => <Button variant="outlined" key={gr.groupId} onClick={() => changeGroup(gr)}>{gr.className}</Button>)}
								</Grid>
							}
						</Grid>
						<Grid container alignItems="center">
							<Grid className="group-btn-con" container alignItems="center">
								<input
									className="file-upload"
									accept="image/*"
									id="contained-button-file"
									type="file"
									onChange={(e) => uploadXlsxFile(e)}
								/>
								<label htmlFor="contained-button-file">
									<Button color="secondary" variant="contained" component="span">
										엑셀로 수강생 목록 불러오기
									</Button>
								</label>
								<p>엑셀은 한 열에 학번만 기재하면 됩니다.</p>
								<Button className="example" variant="outlined" onClick={() => setOpenImg(true)}>예시</Button>
								<Modal
									open={openImg}
									onClose={() => setOpenImg(false)}
									className="img-modal"
								>
									<Paper className="contents-container img-con" elevation={3}>
										<div className="contents-title">
											<h6>엑셀 사용 예시</h6>
											<Button className="x-btn x-btn1" variant="outlined" onClick={() => setOpenImg(false)}><CloseIcon /></Button>
										</div>
										<img src="/img/excelEX.png" alt="엑셀 사용설명 이미지" />
									</Paper>
								</Modal>
							</Grid>
						</Grid>
					</Grid>
				</div>
				<div>
					<div className="contents-title">
						<h6>정보 입력</h6>
					</div>
					<Grid className="set-group-con" container direction="column">
						<Grid container alignItems="center" justify="space-between" wrap="wrap">
							<TextField
								className="group-name-field"
								label="수강생 목록 이름"
								InputProps={{
									startAdornment: (
										<p>🙌🏻</p>
									),
								}}
								inputRef={nameRef}
								onChange={(e) => changeName(e)}
								value={name && name}
							/>
							<Button color="secondary" variant="contained" onClick={addMember}>학생 추가</Button>
						</Grid>
						<Grid container alignItems="center" wrap="wrap" className="member-con">
							{
								members.map((member: string, index: number) =>
									<Grid key={index}>
										<TextField
											label={"학생" + (index + 1)}
											variant="outlined"
											onChange={(e) => changeMember(e, index)}
											onKeyDown={(e) => setMemberByKeyDown(e, index)}
											InputLabelProps={{ shrink: true }}
											rows={1}
											className={"box-container student-container"}
											value={member}
											error={isCorrect(member) ? false : true}
											helperText="학번을 입력해주세요."
											autoFocus={true}
											inputProps={{
												maxLength: 10
											}}
										/>
										<Button onClick={() => deleteMember(index)}><ClearIcon /></Button>
									</Grid>
								)
							}
						</Grid>
					</Grid>
				</div>
			</Paper>
		</Modal>
	);
};

export default StudentPopup;
