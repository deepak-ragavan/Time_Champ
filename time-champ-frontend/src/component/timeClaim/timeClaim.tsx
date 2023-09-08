import moment from 'moment';
import TimeClaimContent from './timeClaimMain/timeClaimContent'
import TimeClaimNav from './timeClaimNav/timeClaimNav'
import { useState } from 'react';

const TimeClaim = () => {
  const [currentWeek, setCurrentWeek] = useState(moment());
  return (
    <div style={{overflow:"auto"}}>
    <TimeClaimNav  currentWeek={currentWeek} setCurrentWeek={setCurrentWeek}/>
    <TimeClaimContent currentWeek={currentWeek} />
    </div>
  )
}

export default TimeClaim