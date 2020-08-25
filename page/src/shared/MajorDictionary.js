const majorDict = {
    920: "컴퓨터과학부"
};

function getMajorStr(majorNumber) {
    majorNumber = Number(majorNumber);
    if (majorNumber in majorDict)
        return majorDict[majorNumber];
    else
        return "학과 정보 없음";
}

export { getMajorStr };