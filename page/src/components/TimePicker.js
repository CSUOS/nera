import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function TimePicker(props) {
  const {start_date, end_date} = props;
  // The first commit of Material-UI
  const [startDate, setStartDate] = React.useState(new Date(start_date));
  const [endDate, setEndDate] = React.useState(new Date(end_date));

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date)=>{
    setEndDate(date);
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