import React from 'react';

import { Snackbar, Grid, Typography, Button, Paper, IconButton, Slide, useScrollTrigger } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

function SaveSnackbar(props) {
	function handleClick(event) {
		if (props.onClick)
			props.onClick(event);
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
				<Grid container direction="row" alignItems="center" justify="center">
					<Grid item direction="column" alignItems="flex-start" justify="flex-end">
						<Typography variant="caption" align="right" style={props.dateCaptionStyle}>{props.modifiedDateStr}</Typography>
						<Typography variant="body2" align="right" style={props.statusStyle}>{props.status}</Typography>
					</Grid>
					<IconButton className="save_component" onClick={handleClick}>
						<SaveIcon fontSize="large" color="primary"/>
					</IconButton>
				</Grid>
			</Paper>
		</Snackbar>
	);

}

export default SaveSnackbar;