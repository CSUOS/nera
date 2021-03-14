import React, { Dispatch, useEffect, useState } from 'react';

import { Modal, Paper, Grid, TextField, Button } from '@material-ui/core';
import { MarkdownEditor } from '../Components';
import { QuestionObj } from '../Main/Type';

type Props = {
	open: boolean;
	handleClose: () => void;
	questionIdx?: number;
	question?: QuestionObj;
	addQuestion: (obj: QuestionObj) => void
	changeQuestion: (index: number, obj: QuestionObj) => void
};

const QuestionPopUp = ({ open, handleClose, question, questionIdx, addQuestion, changeQuestion }: Props) => {
	const [id, setId] = useState<number>(-1); // 생성 시 -1
	const [idx, setIdx] = useState<number>(-1); // 생성 시 -1
	const [contents, setContents] = useState<string>("");
	const [fullScoreString, setFullScoreString] = useState<string>("0");
	const [fullScore, setFullScore] = useState<number>(0);

	useEffect(() => {
		if (question === undefined){
			// 생성 시 초기화
			setIdx(-1);
			setId(-1);
			setContents("");
			setFullScore(0);
			setFullScoreString("0");
			return;
		}
		setId(question.questionId);
		setContents(question.questionContent);
		setFullScore(question.fullScore);
		setFullScoreString(question.fullScore.toString());
	}, [question]);

	useEffect(() => {
		questionIdx && setIdx(questionIdx); // 생성이면 questionIdx가 넘어오기 때문에 setting
	}, [questionIdx])

	useEffect(() => {
		setFullScore(Number(fullScoreString));
	}, [fullScoreString]);

	const checkCorrect = (num: number) => {
		return isNaN(fullScore) || fullScore === undefined || num < 0;
	}

	const saveRenderQuestion = async () => {
		if(checkCorrect(fullScore)){
			alert("배점을 제대로 입력해주세요.");
			return;
		}
		if(contents === ""){
			alert("내용을 입력해주세요.");
			return;
		}
		
		if (idx === -1) {
			// 생성 시
			addQuestion({
				questionId: id,
				questionContent: contents,
				fullScore: fullScore
			});
		} else {
			// 수정 시
			changeQuestion(idx, {
				questionId: id,
				questionContent: contents,
				fullScore: fullScore
			});
		}
		await handleClose();
	}

	const handleScoreChange = (e : React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		e.target &&
		setFullScoreString(e.target.value);
	}

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="add question to assignment"
			aria-describedby="add question to assignment"
			className="modal">
			<Paper className="modal-con contents-container question-popup-con">
				<Grid container direction="column">
					<Grid container justify="space-between">
						<Grid className="contents-title"><h6>문제 내용</h6></Grid>
						<Grid className="right-side">
							<Grid className="score-con">
								배점 :
								<TextField
									className="score-input"
									onChange={handleScoreChange}
									InputLabelProps={{ shrink: true }}
									required
									placeholder="배점"
									rows={1} rowsMax={5}
									variant="standard"
									value={fullScoreString}
									error={checkCorrect(fullScore)}
								// type : number 적용 시키기 => 안됨
								/>
							</Grid>
							<Button className="save_button" variant="contained" color="primary" onClick={saveRenderQuestion}>저장</Button>
						</Grid>
					</Grid>
					<MarkdownEditor
						onChange={setContents}
						contents={question? question.questionContent : ""}
						lines={20}
					/>
				</Grid>
			</Paper>
		</Modal>
	);
};

export default QuestionPopUp;
