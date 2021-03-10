import axios from 'axios';
import crypto from 'crypto';

function hashData(data: any) {
	return crypto.createHash("sha256")
		.update(Buffer.from(data, "utf8").toString('base64'))
		.digest("hex");
}

const getHashedPw = async (password: string) => {
	try {
		const hashToken = await axios.get('/v1/token', { withCredentials: true });
		// token for hashing
		const result = hashData(hashToken.data + hashData(hashData(password)));

		return result;
	}
	catch(err) {
		alert("예기치 못한 오류가 발생하였습니다.\n추가 정보: " + err);
	}
}

export default getHashedPw;