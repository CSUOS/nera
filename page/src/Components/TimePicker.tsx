import 'date-fns';
import React, {useState, useEffect} from 'react';
import { Grid, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

interface Props {
	startHelperText: string;
	endHelperText: string;
    publishingTime: Date;
    deadline: Date;
    setPublishingTime: React.Dispatch<Date>;
    setDeadline: React.Dispatch<Date>;
}

const TimePicker = ({ startHelperText, endHelperText, publishingTime, deadline, setPublishingTime, setDeadline }: Props) => {
	const [startDate, setStartDate] = useState<Date>(new Date(publishingTime));
	const [endDate, setEndDate] = useState<Date>(new Date(deadline));

	useEffect(() => {
		setStartDate(new Date(publishingTime));
		setEndDate(new Date(deadline));
	}, [publishingTime, deadline]);

	const checkCorrect = (date1: Date, date2: Date): boolean => {
		return Number(date1) < Number(date2);
	}

	const startDayChange = (date: MaterialUiPickersDate): void => {
		if (date === null)
			return;

		const tmp = new Date(date);
		tmp.setHours(startDate.getHours());
		tmp.setMinutes(startDate.getMinutes());

		if(checkCorrect(tmp, endDate)) {
			setPublishingTime(tmp);
		} else {
			alert("발행날짜가 마감날짜보다 이후일 수 없습니다.");
			setDeadline(startDate);
		}
	}
  
	const startClockChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const time = e.target.value.split(':');

		const tmp = new Date(startDate);
		tmp.setHours(Number(time[0]));
		tmp.setMinutes(Number(time[1]));

		if (checkCorrect(tmp,endDate)) {
			setPublishingTime(tmp);
		} else {
			alert("발행날짜가 마감날짜보다 이후일 수 없습니다.");
			setDeadline(startDate);
		}
	}

	const endDayChange = (date: MaterialUiPickersDate): void => {
		if (date === null) 
			return;

		const tmp = new Date(date);
		tmp.setHours(endDate.getHours());
		tmp.setMinutes(endDate.getMinutes());

		if(checkCorrect(startDate,tmp)) {
			setDeadline(tmp);
		} else {
			alert("발행날짜가 마감날짜보다 이후일 수 없습니다.");
			setDeadline(endDate);
		}
	}
  
	const endClockChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const time = e.target.value.split(':');

		const tmp = new Date(endDate);
		tmp.setHours(Number(time[0]));
		tmp.setMinutes(Number(time[1]));

		if(checkCorrect(startDate,tmp)){
			setDeadline(tmp);
		}else{
			alert("발행날짜가 마감날짜보다 이후일 수 없습니다.");
			setDeadline(endDate);
		}
	}

	function timeFormat(date: Date): string{
		let hour = "";
		let minutes = "";

		if(date.getHours() < 10) {
			hour = "0" + date.getHours();
		} else {
			hour = String(date.getHours());
		}

		if(date.getMinutes() < 10) {
			minutes = "0" + date.getMinutes();
		} else {
			minutes = String(date.getMinutes());
		}

		return hour + ":" + minutes;
	}

	return (
		<Grid className="time-picker">
			{
				startDate && endDate &&
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Grid container spacing={1}>
							<Grid item>
								<KeyboardDatePicker
									disableToolbar
									variant="inline"
									format="MM/dd/yyyy"
									id="start_day_picker"
									label="시작 날짜"
									value={startDate}
									onChange={startDayChange}
									helperText={startHelperText}
									required
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}}
								/>
							</Grid>
							<Grid item>
								<TextField
									id="start_time_picker"
									label="시작 시각"
									type="time"
									defaultValue={timeFormat(startDate)}
									onChange={startClockChange}
									required
									InputLabelProps={{
										shrink: true,
									}}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={1}>
							<Grid item>
								<KeyboardDatePicker
									disableToolbar
									variant="inline"
									format="MM/dd/yyyy"
									id="end_day_picker"
									label="마감 날짜"
									value={endDate}
									onChange={endDayChange}
									helperText={endHelperText}
									required
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}}
								/>
							</Grid>
							<Grid item>
								<TextField
									id="end_time_picker"
									label="마감 시각"
									type="time"
									defaultValue={timeFormat(endDate)}
									onChange={endClockChange}
									required
									InputLabelProps={{
										shrink: true,
									}}
								/>
							</Grid>
						</Grid>
					</MuiPickersUtilsProvider>
			}
		</Grid>
	);
}

export default TimePicker;