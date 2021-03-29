import React, { useEffect, useState } from 'react';

import { Grid } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import PageInfo from '../Components/PageInfo';
import AssignmentBox from '../Components/AssignmentBox';

import { useUserState } from '../Main/Model/UserModel';
import { useAssignmentState } from '../Main/Model/AssignmentModel';
import { SortedAssignObj } from '../Main/Type';
import { getColorState, getSortedAssign } from '../utils';

const Main = () => {
	const user = useUserState();
	const assignments = useAssignmentState();
	const [sortedAssign, setSortedAssign] = useState<SortedAssignObj>([[],[],[],[]]);

	useEffect(() => {
		assignments && user &&
		setSortedAssign(getSortedAssign(assignments, user.type));
	}, [assignments]);
	
	return (
		<>
			{(user) &&
			<Grid container direction="column">
				<PageInfo 
					icon={user.type === 'professor' ? "👨🏻‍💼" :"👩🏻‍💻"}
					mainTitle={user.userName}
					subTitle={user.type === 'professor' ? `교수 / ${user.userNumber}` : `학생 / ${user.userNumber} / ${user.major}`}
					information={<p>좌측 사이드바 또는 아래 목록에서 확인하려는 과제를 선택하세요.</p>}
				/>
				<Grid container direction="column" className="contents-container">
					{
						sortedAssign && user &&
						sortedAssign.map((_, index : number) => 
							( index === 0 || index === 1 ) &&
							<Grid key={index}>
								<Grid className="contents-title">
									<h6>{user.type === 'professor' ? getColorState(index).professorState : getColorState(index).studentState}</h6>
								</Grid>
								<Grid className="assignment-rootbox">
									{
										sortedAssign[index].map((as) =>	
											<AssignmentBox 
												key={as.assignmentId}
												type={user.type}
												asInfo={as}
												state={getColorState(index)}
											/>)
									}
								</Grid>
							</Grid>
						)
					}
				</Grid>
			</Grid>
			}
		</>
	);
}

export default Main;
