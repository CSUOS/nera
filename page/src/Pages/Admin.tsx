import React, { useEffect, useState } from 'react';

import { useHistory } from "react-router-dom";
import { TextField, Switch, Button, Grid } from "@material-ui/core";
import { saveMessage, useMessageState, useOnOffState } from "../Main/Model/MessageModel";

const Admin = () => {
	const history = useHistory();
	const saveFunction = saveMessage();
	const m = useMessageState(); const o = useOnOffState();

	const [message, setMessage] = useState<string>("");
	const [onOff, setOnOff] = useState<boolean>(false);

	const onSubmit = () => {
		saveFunction(message, onOff);
	};

	useEffect(() => {
		const key = prompt("What is the key of admin?");
		console.log(process.env.REACT_APP_ADMIN_KEY);
		if (key !== process.env.REACT_APP_ADMIN_KEY) {
			alert("You are not Admin, Sorry.");
			history.push("/");
		}
	}, []);

	useEffect(() => {
		setMessage(m); setOnOff(o);
	}, [m, o]);

	return (
		<Grid className="admin-form-con">
			<Grid>
				<TextField multiline name="message" value={message} variant="outlined" onChange={(e) => setMessage(e.target.value)}/>
				<Grid>
					<Switch name="onOff" checked={onOff} onChange={(e) => setOnOff(e.target.checked)}/>
					<Button onClick={onSubmit}>SAVE</Button>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Admin;
