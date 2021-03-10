import { AssignmentObj, SortedAssignObj } from "../Main/Type";

const getSortedAssign = (assignment: Array<AssignmentObj>, type: string): SortedAssignObj => {
	// 0 : 공개 전 / 1 : 제출 중 / 2: 채점 중 / 3 : 채점 완료
	// 교수 => 2 > 0 > 1 > 3
	// 학생 => 1 > 3 > 2 > 0

	const obj: SortedAssignObj = [[], [], [], []];
	if (type === 'professor') {
		// 교수이면
		assignment.forEach((as: AssignmentObj) => {
			switch (as.assignmentState) {
			case 2:
				obj[0].push(as);
				break;
			case 0:
				obj[1].push(as);
				break;
			case 1:
				obj[2].push(as);
				break;
			case 3:
				obj[3].push(as);
			}
		})
	} else if (type === 'student'){
		// 학생이면
		assignment.forEach((as: AssignmentObj) => {
			switch (as.assignmentState) {
			case 1:
				obj[0].push(as);
				break;
			case 3:
				obj[1].push(as);
				break;
			case 2:
				obj[2].push(as);
				break;
			case 0:
				obj[3].push(as);
			}
		})
	}
	return obj;
}

export default getSortedAssign;
