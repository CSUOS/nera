import { getMajorStr } from '.';
import jwt from 'jsonwebtoken';
import { UserObj } from '../Main/Type';

const getCookie = (name: string) => {
	const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return value? value[2] : null;
}

const getUserInfo = () => {
	const token = getCookie('access_token');
	if(!token) {
		return undefined;
	}

	// 저장된 정보 decode
	const decoded = jwt.decode(token);
	if(!decoded) {
		return undefined;
	}

	if(typeof(decoded) === "string") { // 수정필요
		return undefined;
	}

	// 교수, 학생 type 저장
	console.log(decoded.type);
	decoded.type = String(decoded.userNumber)[0] === '1' ? 'professor' : 'student';

	// major 저장
	const major = String(decoded.userNumber).substring(4,7);
	decoded.major = decoded.type === 'professor' ? "" : getMajorStr(major);

	const result: UserObj = {
		userId: decoded.userId as string,
		userName: decoded.userName ,
		userNumber: decoded.userNumber,
		major: decoded.major,
		type: decoded.type,
	}
	
	console.log(decoded);
	return result ? result : undefined;
}

export default getUserInfo;