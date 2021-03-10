export const compareElements = (a, b, orderBy) => {
	if (a[orderBy] < b[orderBy])
		return -1;
	else if (a[orderBy] > b[orderBy])
		return 1;
	else
		return 0;
}

const sortRows = (rows, order, orderBy) => {
	const mappedList = rows.map((element, index) => [element, index]);
	mappedList.sort((a, b) => {
		const compared = compareElements(a[0], b[0], orderBy);
		return order === "asc" ? compared : -compared;
	});
	return mappedList.map((el) => el[0]);
}

export default sortRows;