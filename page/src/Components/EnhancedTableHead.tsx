import React from 'react';

import { TableHead, TableCell,  TableRow, TableSortLabel, Checkbox}  from '@material-ui/core';

type Props = {
	classes: any;
	numSelected: number;
	onRequestSort: any;
	onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
	order: 'asc' | 'desc';
	orderBy: string;
	rowCount: number;
	headCells: any[];
}

const EnhancedTableHead = ({ classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } : Props) => {
	const createSortHandler = (property: string) => (event: React.MouseEvent) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox" >
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{ 'aria-label': 'select all questions' }}
					/>
				</TableCell>
				{headCells.map((headCell, idx) => (
					<TableCell
						key={idx}
						padding={headCell.disablePadding ? 'none' : 'default'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id && <span className={classes.visuallyHidden}>{order === 'desc' ? '내림 차순 정렬됨' : '오름 차순 정렬됨'}</span>}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	)
}

export default EnhancedTableHead;