import React, {
	createContext, Dispatch, useContext, useEffect, useState
} from 'react';
import axios from 'axios';

import { childrenObj, MessageObj } from '../Type';

const MessageState = createContext<string>("");
const MessageDispatch = createContext<Dispatch<string>>(() => { });
const OnOffState = createContext<boolean>(false);
const OnOffDispatch = createContext<Dispatch<boolean>>(() => { });
const SaveMessage = createContext<(msg: string, onff: boolean) => void>(() => { });

export const MessageContextProvider = ({ children }: childrenObj) => {
	const [message, setMessage] = useState<string>("");
	const [onOff, setOnOff] = useState<boolean>(false);

	const fetchMSG = () => {
		axios.get("/v1/message")
			.then(res => {
				setMessage(res.data.message);
				setOnOff(res.data.onOff);
			})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("그룹 정보를 얻는 중 예기치 못한 예외가 발생하였습니다. (Main.js)\n" + JSON.stringify(err));
				}
				else if (status === 404) {
					alert("메세지를 찾을 수 없습니다. 직접 생성해주세요.");
				}
			});
	};

	useEffect(() => {
		// 처음에 메세지 받아오기
		fetchMSG();
	}, [])

	const saveMessage = (msg: string, onff: boolean) => {
		axios.post("/v1/message", {
			message: msg,
			onOff: onff
		}).then(res => {
			const data : MessageObj = res.data;
			setMessage(data.message);
			setOnOff(data.onOff);
		})
			.catch(err => {
				const status = err?.response?.status;
				if (status === undefined) {
					alert("그룹 정보를 얻는 중 예기치 못한 예외가 발생하였습니다. (Main.js)\n" + JSON.stringify(err));
				}
				else if (status === 404) {
					alert("메세지를 찾을 수 없습니다. 직접 생성해주세요.");
				}
			});
	}

	return (
		<MessageState.Provider value={message}>
			<MessageDispatch.Provider value={setMessage}>
				<OnOffState.Provider value={onOff}>
					<OnOffDispatch.Provider value={setOnOff}>
						<SaveMessage.Provider value={saveMessage}>
							{children}
						</SaveMessage.Provider>
					</OnOffDispatch.Provider>
				</OnOffState.Provider>
			</MessageDispatch.Provider>
		</MessageState.Provider>
	);
}

export function useMessageState() {
	const context = useContext(MessageState);
	return context;
}
export function useMessageDispatch() {
	const context = useContext(MessageDispatch);
	return context;
}
export function useOnOffState() {
	const context = useContext(OnOffState);
	return context;
}
export function useOnOffDispatch() {
	const context = useContext(OnOffDispatch);
	return context;
}
export function saveMessage() {
	const context = useContext(SaveMessage);
	return context;
}

