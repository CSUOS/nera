export function modifiedDateToString(date) {
    if (date === undefined)
        return "저장 기록 없음";

    let dateStr = date.getFullYear() + "-" 
                + (date.getMonth()+1 <= 9 ? "0" : "") + (date.getMonth()+1) + "-"
                + (date.getDate() <= 9 ? "0" : "") + date.getDate() + " "
                + (date.getHours() <= 9 ? "0" : "") + date.getHours() + ":"
                + (date.getMinutes() <= 9 ? "0" : "") + date.getMinutes();
    return dateStr + "에 저장함";
}