export const isStringBlank = (s : string) => {
	if(s === "")
		return true;
	if(s.trim() === "")
		return true;
	return false;
}
