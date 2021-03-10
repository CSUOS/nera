import React from 'react';

import { Snackbar, Grid, Paper, IconButton } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

type SnackBarType = {
	onClickFun : () => void,
	modifiedDateStr : string,
	status : string
}

// 과제를 저장한 후 오른쪽 아래에 뜨는 저장 알림
const SaveSnackbar = ({onClickFun, modifiedDateStr, status} : SnackBarType) => {
	const handleClick = () => {
		onClickFun();
	}

	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			open={true}
		>
			<Paper className="save_paper" elevation={4}>
				<Grid className="save-paper-head">
					<p>{modifiedDateStr}에 저장함</p>
				</Grid>
				<Grid className="save-paper-body">
					<p>{status}</p>
					<IconButton className="save_component" onClick={handleClick}>
						<SaveIcon fontSize="large" color="primary"/>
					</IconButton>
				</Grid>
			</Paper>
		</Snackbar>
	);

}

export default SaveSnackbar;