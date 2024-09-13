import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

interface TimeSlotProps {
  time: string;
  plan: string;
  onPlanChange: (plan: string) => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, plan, onPlanChange }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="subtitle1">{time}</Typography>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={plan}
        onChange={(e) => onPlanChange(e.target.value)}
        placeholder="계획을 입력하세요"
      />
    </Grid>
  );
};

export default TimeSlot;
