import React, { useState } from 'react';
import { Grid, Paper } from '@mui/material';
import TimeSlot from './TimeSlot';
import { format, addHours } from 'date-fns';

const DailyPlanner: React.FC = () => {
  const [plans, setPlans] = useState<{ [key: string]: string }>({});

  const handlePlanChange = (time: string, plan: string) => {
    setPlans(prevPlans => ({ ...prevPlans, [time]: plan }));
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const date = addHours(new Date().setHours(0, 0, 0, 0), i);
    return format(date, 'HH:mm');
  });

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Grid container spacing={2}>
        {timeSlots.map(time => (
          <TimeSlot
            key={time}
            time={time}
            plan={plans[time] || ''}
            onPlanChange={(plan) => handlePlanChange(time, plan)}
          />
        ))}
      </Grid>
    </Paper>
  );
};

export default DailyPlanner;
