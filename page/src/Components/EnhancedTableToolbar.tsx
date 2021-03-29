/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect } from 'react';
import { Table, TableHead, TableBody, TableCell, TableContainer, TablePagination, TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox}  from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';


const useStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:
        theme.palette.type === 'light' ? 
        	{
        		color: theme.palette.secondary.main, backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        	}
        	: {
        		color: theme.palette.text.primary,
        		backgroundColor: theme.palette.secondary.dark,
        	},
	title: {
		flex: '1 1 100%',
	},
}));

type Props = {
  numSelected: number;
  type: "question" | "student";
}

const EnhancedTableToolbar = ({numSelected, type} : Props) => {
	const classes = useStyles();

	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}
		>
			{numSelected > 0 ? (
				<Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
					{numSelected}{type === "question" ? "개" : "명"}의 {type === "question" ? "문제를" : "학생을"} 선택함
				</Typography>
			) : (
				<Typography className={classes.title} variant="h6" id="tableTitle" component="div">
					채점할 {type === "question" ? "문제" : "학생"} 선택
				</Typography>
			)}
		</Toolbar>
	)
}

export default EnhancedTableToolbar;