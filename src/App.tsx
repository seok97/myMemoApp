import React from 'react';
import { Container, Typography } from '@mui/material';
import CircularTimeTable from './components/CircularTimeTable';

const App: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h2" align="center" gutterBottom>
        24시간 원형 계획표
      </Typography>
      <CircularTimeTable />
    </Container>
  );
};

export default App;
