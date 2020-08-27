import 'date-fns';
import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function TimePicker(props) {
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const {setStartDate, setEndDate} = props;

  useEffect(()=>{
    setStart(new Date(props.startDate));
    setEnd(new Date(props.endDate));
    
  }, []);

  const handleStartChange = (date) => {
    if(checkCorrect(date,end)){
      setStart(date);
      setStartDate(date);
    }else{
      alert("발행날짜가 마감날짜보다 이후일 수 없습니다.");
      setStart(start);
    }
  }
  
  const handleEndChange = (date)=>{
    if(checkCorrect(start,date)){
      setEnd(date);
      setEndDate(date);
    }else{
      alert("마감날짜가 발행날짜보다 이전일 수 없습니다.");
      setEnd(end);
    }
  }

  const checkCorrect = (date1, date2)=>{
    if(date1.getTime()<=date2.getTime()){ // 시작 날짜가 마감 날짜 전이라면
      return true;
    }else if(date1.getYear()==date2.getYear()){ // 시간까지 따지지 않고, 같은 일자라면
      if(date1.getMonth()==date2.getMonth()){
        if(date1.getDay()==date2.getDay())
          return true;
        else
          return false;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
  
  return (
    <Grid container direction="row">
      {
      (start!==undefined && end !== undefined)?
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid xs={6}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-dialog"
            label="과제 시작 날짜"
            value={start}
            onChange={handleStartChange}
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
            value={end}
            onChange={handleEndChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
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