import 'date-fns';
import React, {useState, useEffect} from 'react';
import { Grid, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
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
    tmp.setHours(startDate.getHours());
    tmp.setMinutes(startDate.getMinutes());
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
    tmp.setHours(endDate.getHours());
    tmp.setMinutes(endDate.getMinutes());
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
    }else if(date1.getYear()===date2.getYear()){ // second까지 따지지 않고, 시간 대소
      if(date1.getMonth()===date2.getMonth()){
        if(date1.getDay()===date2.getDay()){
          if(date1.getHours()===date2.getHours()){
            if(date1.getMinutes()===date2.getMinutes()){
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
    <Grid container className="setting_as_row" direction="row">
      {
      (startDate!==undefined && endDate!== undefined)?
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container spacing={1}>
            <Grid item>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                id="start_day_picker"
                label="과제 시작 날짜"
                value={startDate}
                onChange={startDayChange}
                helperText={props.startHelperText}
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
                label="과제 마감 날짜"
                value={endDate}
                onChange={endDayChange}
                helperText={props.endHelperText}
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
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
        :null
      }
    </Grid>
  );
}

export default TimePicker;