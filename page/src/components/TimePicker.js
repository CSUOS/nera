import 'date-fns';
import React, {useState, useEffect} from 'react';
import { Grid, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function TimePicker(props) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const {setPublishingTime, setDeadline} = props;

  useEffect(()=>{
    setStartDate(new Date(props.publishingTime));
    setEndDate(new Date(props.deadline));
  }, []);

  const startDayChange = (date) => {
    let tmp = new Date(date);
    tmp.setTime(startDate.getTime());
    if(checkCorrect(tmp,endDate)){
      setStartDate(tmp);
      setPublishingTime(tmp);
    }else{
      alert("발행날짜가 마감날짜보다 이후일 수 없습니다.");
    }
  }
  
  const startClockChange = (e)=>{
    const time = e.target.value.split(':');
    let tmp = new Date(startDate);
    tmp.setHours(time[0]);
    tmp.setMinutes(time[1]);
    if(checkCorrect(tmp,endDate)){
      setStartDate(tmp);
      setPublishingTime(tmp);
    }else{
      alert("발행날짜가 마감날짜보다 이후일 수 없습니다.");
    }
  }

  const endDayChange = (date) => {
    let tmp = new Date(date);
    tmp.setTime(endDate.getTime());
    if(checkCorrect(startDate,tmp)){
      setEndDate(tmp);
      setDeadline(tmp);
    }else{
      alert("발행날짜가 마감날짜보다 이후일 수 없습니다.");
    }
  }
  
  const endClockChange = (e)=>{
    const time = e.target.value.split(':');
    let tmp = new Date(endDate);
    tmp.setHours(time[0]);
    tmp.setMinutes(time[1]);
    if(checkCorrect(startDate,tmp)){
      setEndDate(tmp);
      setDeadline(tmp);
    }else{
      alert("발행날짜가 마감날짜보다 이후일 수 없습니다.");
    }
  }

  const checkCorrect = (date1, date2)=>{
    if(date1.getTime()<=date2.getTime()){ // 시작 날짜가 마감 날짜 전이라면
      return true;
    }else if(date1.getYear()==date2.getYear()){ // second까지 따지지 않고, 시간 대소
      if(date1.getMonth()==date2.getMonth()){
        if(date1.getDay()==date2.getDay()){
          if(date1.getHours()==date2.getHours()){
            if(date1.getMinutes()==date2.getMinutes()){
              return true;
            }else{
              return false;
            }
          }else{
            return false;
          }
        }
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  function timeFormat(date){
    let hour = date.getHours();
    if(hour<10)
      hour="0"+hour;
    let minutes = date.getMinutes();
    if(minutes<10)
      minutes="0"+minutes;

    return hour+":"+minutes;
  }

  return (
    <Grid container direction="row">
      {
      (startDate!==undefined && endDate!== undefined)?
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={3}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-dialog"
              label="과제 시작 날짜"
              value={startDate}
              onChange={startDayChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="time"
              label="시작 시각"
              type="time"
              defaultValue={timeFormat(startDate)}
              onChange={startClockChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-dialog"
              label="과제 마감 날짜"
              value={endDate}
              onChange={endDayChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="time"
              label="마감 시각"
              type="time"
              defaultValue={timeFormat(endDate)}
              onChange={endClockChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        :null
      }
    </Grid>
  );
}

export default TimePicker;