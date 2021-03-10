const colorState = [{
	studentState: '제출 중인 과제',
	professorState: '채점 중인 과제',
	color: 'red',
}, {
	studentState: '채점 완료된 과제',
	professorState: '공개 전 과제',
	color: 'orange',
}, {
	studentState: '채점 중인 과제',
	professorState: '제출 중인 과제',
	color: 'green',
}, {
	studentState: '공개 전 과제',
	professorState: '채점 완료된 과제',
	color: 'gray',
}]

const getColorState = (index: number) => {
	return colorState[index];
}

export default getColorState;