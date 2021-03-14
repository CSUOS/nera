import React from 'react';
import { TableCell, TableHead, TableRow, TableSortLabel } from '@material-ui/core';

type Props = {
	headCells: any;
	onRequestSort: any;
	order: any;
	orderBy: any;
}

const SortedTableHead = ({headCells, onRequestSort, order, orderBy} : Props) => {
	const getSortHandler = (id: any) => {
		return (e: React.MouseEvent) => onRequestSort(e, id);
	};
	return (
		<TableHead>
			<TableRow>
				<TableCell />
				{headCells.map((headCell: {id: string; label: string; allowSorting: boolean;}) => (
					<TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
						{headCell.allowSorting ?
							<TableSortLabel
								active={orderBy === headCell.id}
								direction={orderBy === headCell.id ? order : "asc"}
								onClick={getSortHandler(headCell.id)}
							>
								{headCell.label}
								{orderBy === headCell.id &&
								<span>{order === "desc" ? "(내림차순)" : "(오름차순)"}</span>
								} 
							</TableSortLabel> :
							headCell.label
						}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	)
}

export default SortedTableHead;