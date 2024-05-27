import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import axios from 'axios';
import dayjs from 'dayjs';

export default function BasicDateRangePicker({ offerId, value, onChange }) {
  const [disabledDates, setDisabledDates] = React.useState([]);

  React.useEffect(() => {
    axios.get(`http://localhost:8000/disabled_dates/${offerId}`)
      .then(response => {
        const dates = response.data.map(date => dayjs(date));
        setDisabledDates(dates);
      })
      .catch(error => {
        console.error('Error fetching disabled dates:', error);
      });
  }, [offerId]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker']}>
        <DateRangePicker
          localeText={{ start: 'Check-in', end: 'Check-out' }}
          value={value}
          onChange={onChange}
          shouldDisableDate={(date) => {
            return disabledDates.some(disabledDate => date.isSame(disabledDate, 'day'));
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
