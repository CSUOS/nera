const arrayToString = (arr: any[], unit: any) => {
	if(arr.length <= 3) {
		return arr.join(", ");
	}
	else {
		return `${arr.slice(0, 1).join(", ")}를 포함한 ${arr.length}${unit}`;
	}
}

export default arrayToString;