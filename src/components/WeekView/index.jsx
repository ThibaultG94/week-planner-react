import React from 'react';
import DayCard from './DayCard';
import { DAYS_OF_WEEK } from '../../utils/constants';

const WeekView = ({ tasks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {DAYS_OF_WEEK.map((day) => (
        <DayCard 
          key={day} 
          day={day}
          tasks={tasks.filter(task => task.day === day)}
        />
      ))}
    </div>
  );
};

export default WeekView;