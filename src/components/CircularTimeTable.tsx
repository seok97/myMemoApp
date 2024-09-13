import React, { useState, KeyboardEvent } from 'react';
import { Box, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { SketchPicker } from 'react-color';

interface Plan {
  id: number;
  startTime: string;
  endTime: string;
  description: string;
  color: string;
}

const CircularTimeTable: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('01:00');
  const [currentPlan, setCurrentPlan] = useState('');
  const [currentColor, setCurrentColor] = useState('#FF9999');
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const radius = 200;
  const center = radius + 40;

  const addPlan = () => {
    if (currentPlan.trim() !== '') {
      if (editingPlan) {
        setPlans(plans.map(plan => 
          plan.id === editingPlan.id 
            ? { ...plan, startTime, endTime, description: currentPlan, color: currentColor }
            : plan
        ));
        setEditingPlan(null);
      } else {
        setPlans([...plans, { 
          id: Date.now(), 
          startTime, 
          endTime, 
          description: currentPlan,
          color: currentColor
        }]);
      }
      setCurrentPlan('');
      setStartTime('00:00');
      setEndTime('01:00');
      setCurrentColor('#FF9999');
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      addPlan();
    }
  };

  const deletePlan = (id: number) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  const editPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setCurrentPlan(plan.description);
    setStartTime(plan.startTime);
    setEndTime(plan.endTime);
    setCurrentColor(plan.color);
  };

  const getCoordinates = (time: string, offset: number = 0) => {
    const [hours, minutes] = time.split(':').map(Number);
    const angle = ((hours + minutes / 60) / 24) * Math.PI * 2 - Math.PI / 2;
    const x = center + (radius + offset) * Math.cos(angle);
    const y = center + (radius + offset) * Math.sin(angle);
    return { x, y };
  };

  const getArc = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startAngle = ((startHours + startMinutes / 60) / 24) * Math.PI * 2 - Math.PI / 2;
    const endAngle = ((endHours + endMinutes / 60) / 24) * Math.PI * 2 - Math.PI / 2;
    
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    const startX = center + radius * Math.cos(startAngle);
    const startY = center + radius * Math.sin(startAngle);
    const endX = center + radius * Math.cos(endAngle);
    const endY = center + radius * Math.sin(endAngle);

    return `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  };

  const wrapText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    const wrapped = text.substring(0, maxLength);
    const lastSpace = wrapped.lastIndexOf(' ');
    return lastSpace > 0 ? wrapped.substring(0, lastSpace) + '...' : wrapped + '...';
  };

  const handleColorChange = (color: any) => {
    setCurrentColor(color.hex);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <svg width={center * 2} height={center * 2}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="black" />
        {plans.map((plan) => (
          <path
            key={plan.id}
            d={getArc(plan.startTime, plan.endTime)}
            fill={plan.color}
            opacity={0.5}
          />
        ))}
        <path
          d={getArc(startTime, endTime)}
          fill="none"
          stroke="red"
          strokeWidth="3"
        />
        {[...Array(24)].map((_, i) => {
          const { x, y } = getCoordinates(`${i}:00`);
          const { x: labelX, y: labelY } = getCoordinates(`${i}:00`, 20);
          return (
            <g key={i}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="gray"
                strokeWidth="1"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
              >
                {i.toString().padStart(2, '0')}
              </text>
            </g>
          );
        })}
        {plans.map((plan) => {
          const midTime = new Date((new Date(`2000/01/01 ${plan.startTime}`).getTime() + new Date(`2000/01/01 ${plan.endTime}`).getTime()) / 2).toTimeString().slice(0, 5);
          const { x, y } = getCoordinates(midTime, -20);
          return (
            <text
              key={plan.id}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="black"
            >
              {wrapText(plan.description, 15)}
            </text>
          );
        })}
      </svg>
      <Box mt={2} width="100%" maxWidth="500px">
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            label="시작 시간"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            inputProps={{ step: 60 }}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="종료 시간"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            inputProps={{ step: 60 }}
          />
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            fullWidth
            label="계획"
            value={currentPlan}
            onChange={(e) => setCurrentPlan(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button 
            onClick={() => setShowColorPicker(!showColorPicker)} 
            style={{ 
              marginLeft: '10px', 
              height: '56px', 
              backgroundColor: currentColor,
              minWidth: '56px'
            }}
          />
          <Button onClick={addPlan} style={{ marginLeft: '10px', height: '56px' }}>
            {editingPlan ? '수정' : '추가'}
          </Button>
        </Box>
        {showColorPicker && (
          <Box mb={2}>
            <SketchPicker
              color={currentColor}
              onChangeComplete={handleColorChange}
            />
          </Box>
        )}
      </Box>
      <Box mt={2} width="100%" maxWidth="500px">
        {plans.map((plan) => (
          <Box key={plan.id} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center">
              <Box 
                width={20} 
                height={20} 
                bgcolor={plan.color} 
                mr={1} 
                style={{ borderRadius: '50%' }}
              />
              <span>{`${plan.startTime} - ${plan.endTime}: ${plan.description}`}</span>
            </Box>
            <Box>
              <IconButton onClick={() => editPlan(plan)} size="small">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deletePlan(plan.id)} size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CircularTimeTable;