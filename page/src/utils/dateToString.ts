const modifiedDateToString = (date : Date | undefined) => {
	if (date === undefined)
		return "";
	if (typeof(date) === "string")
		date = new Date(date);

	const dateStr = date.getFullYear() + "-" 
                + (date.getMonth()+1 <= 9 ? "0" : "") + (date.getMonth()+1) + "-"
                + (date.getDate() <= 9 ? "0" : "") + date.getDate() + " "
                + (date.getHours() <= 9 ? "0" : "") + date.getHours() + ":"
                + (date.getMinutes() <= 9 ? "0" : "") + date.getMinutes();
	return dateStr;
};

export default modifiedDateToString;
