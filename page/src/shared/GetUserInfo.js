import { getMajorStr } from '../shared/MajorDictionary';

function getCookie(name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
};

function getUserInfo(){
    const jwt = require('jsonwebtoken');

    try{
        const access_token = getCookie('access_token');
        const token = jwt.decode(access_token);

        // 사용자의 major (ex. 920 => 컴과, MajorDictionary.js에 정의되어 있음)
        // type이 1일 때만 setting
        // type이 0이면(교수면) default로 ""
        token.type = String(token.userNumber)[0] == '1' ? 0 : 1;
        const majorNumber = String(token.userNumber).substring(4,7);
        if(token.type===0)
            token.major = "";
        else if(token.type===1)
            token.major = getMajorStr(majorNumber);

        return token;
    }catch(err){
        alert(`사용자 정보를 가져오는 중 오류가 발생하였습니다. (${err})`);
        throw err;
    }
}

export {getUserInfo};
    