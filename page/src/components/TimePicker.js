import 'date-fns';
import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function TimePicker(props) {
  const [dataContent, setDateContent] = useState(<div></div>);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(()=>{
    setStartDate(Date(props.startDate));
    setEndDate(Date(props.endDate));
  }, [props.startDate, props.endDate]);

  const handleStartDateChange = (date) => {
    if(date.getTime()<=endDate.getTime()){
      // 해당 날짜 포함으로 고쳐야함
      setStartDate(date);
    }else{
      alert("발행날짜가 마감날짜보다 이후일 수 없습니다.");
      setStartDate(startDate);
    }
    setStartDate(date);
  };
  
  const handleEndDateChange = (date)=>{
    if(date.getTime()>=startDate.getTime()){
      // 해당 날짜 포함으로 고쳐야함
      setEndDate(date);
    }else{
      alert("마감날짜가 발행날짜보다 이전일 수 없습니다.");
      setEndDate(endDate);
    }
  }

  return (
    <Grid container direction="row">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid xs={6}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-dialog"
            label="과제 시작 날짜"
            value={startDate}
            onChange={handleStartDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>
        <Grid xs={6}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-dialog"
            label="과제 마감 날짜"
            value={endDate}
            onChange={handleEndDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    </Grid>
  );
}