// Constants Definition

export const TABLE__SCORE = [ // for score table 
	{
		id: "userNumber",
		label: "학번",
		allowSorting: true
	},
	{
		id: "submittedCount",
		label: "제출한 문제 수",
		allowSorting: true
	},
	{
		id: "markedCount",
		label: "채점한 문제 수",
		allowSorting: true
	},
	{
		id: "allMarked",
		label: "채점 완료 여부",
		allowSorting: true
	},
	{
		id: "scoreSum",
		label: "총 점수",
		allowSorting: true
	}
];

export const TABLE__QUESTION = [
	{ 
		id: 'questionNumber',
		disablePadding: true, 
		label: '문제 번호' 
	},
	{ 
		id: 'questionId',
		disablePadding: false, 
		label: '문제 ID' 
	}
];

export const TABLE__STUDENTS = [
	{ 
		id: 'userNumber',
		disablePadding: true, 
		label: '학번' 
	},
	{ 
		id: 'submitted',
		disablePadding: false, 
		label: '답안을 하나 이상 제출함' 
	},
	{ 
		id: 'marked',
		disablePadding: false, 
		label: '채점을 완료함' 
	}
];