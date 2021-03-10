/* todo : type => model에 각각 넣기 */

export type ActionType = {
	type: string;
	content?: {
		value? : any;
		index? : number;
	}
}

export type childrenObj = {
	children: React.ReactNode;
}

export type meta = {
	createAt : Date;
	modifiedAt : Date;
}

export type AssignmentObj = {
	// 서버에서 받아오는 form
	assignmentId : number;
	professor : number;
	students : Array<number>;
	assignmentName : string;
	assignmentInfo : string;
	assignmentState: number;
	publishingTime : Date;
	deadline : Date;
	questions : Array<QuestionObj>;
	meta? : meta;
}

export type AddAssignmentObj = {
	students : Array<number>;
	assignmentName : string;
	assignmentInfo : string;
	publishingTime : Date;
	deadline : Date;
	questions : Array<QuestionObj>;
}

export type UpdateAssignmentObj = {
	assignmentId : number;
	students : Array<number>;
	assignmentName : string;
	assignmentInfo : string;
	publishingTime : Date;
	deadline : Date;
	questions : Array<QuestionObj>;
}

export type QuestionObj = {
	questionId : number;
	questionContent : string;
	fullScore : number;
}

export type QuestionWithoutIdObj = {
	questionId? : number;
	questionContent : string;
	fullScore : number;
}

export type QuestionAnswerObj = {
	professorNumber : number;
	userNumber : number;
	assignmentId : number;
	answers : Array<AnswerObj>;
	meta? : meta;
}

export type AnswerObj = {
	questionId : number;
	answerContent : string;
	score? : number;
	_id?: string;
}

const typeString = ['professor', 'student'];

export type UserObj = {
	userId : string;
	userName : string;
	userNumber : number;
	type: 'professor' | 'student';
	major : string;
	meta? : meta;
}

export type RequestGroupObj = {
	className : string;
	students: Array<number>;
	groupId : number;
}

export type GroupObj = {
	groupId : number;
	className : string;
	professor: number;
	students: Array<number>;
	meta?: meta;
}

export type answerType = {
	[questionId : number] : {
        answerContent : string;
        score : number;
	}
}

// user type과 assignment의 state에 따라 중요도가 달라지므로 정렬된 assignment가 필요 
// 정렬하는 함수는 utils 폴더의 getSortedAssign 함수
// 3개의 배열로 나뉘어서 중요도를 내림차순으로 나타냄 => 배열 안의 배열은 과제의 모음
export type SortedAssignObj = Array<Array<AssignmentObj>>

export type MessageObj = {
	message : string;
	onOff : boolean;
}