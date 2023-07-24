import { useState } from 'react';
import moment from 'moment';
import './weeklyDataFilter.scss'

const WeeklyCalendar : React.FC<{currentWeek:moment.Moment,setCurrentWeek:(val:moment.Moment)=>void}> = ({currentWeek,setCurrentWeek}) => {
  
  const [currentWeekNumber,setCurrentWeekNumber] = useState(Math.ceil(currentWeek.clone().endOf('week').date()/7));
  const [currentWeekMonth,setCurrentWeekMonth] = useState(currentWeek.format("MMM"))
  const [mixedWeekAnotherMonth,setMixedWeekAnotherMonth] = useState(currentWeek.format("MMM"));
  const [isMixedWeek,setIsMixedWeek] = useState(false);

  const getWeekDetails = (thisWeek:moment.Moment) => {
      let startOfWeekMonth = thisWeek.clone().startOf('week').clone().startOf('month').month() + 1
      let endOfWeekMonth = thisWeek.clone().endOf('week').clone().startOf('month').month() + 1
      if(startOfWeekMonth!==endOfWeekMonth) {
        setIsMixedWeek(true);
        setCurrentWeekMonth(thisWeek.clone().startOf('week').endOf('month').format('MMM'))
        setMixedWeekAnotherMonth(thisWeek.clone().endOf('week').endOf('month').format('MMM'))
      } else {
        setIsMixedWeek(false);
        const endOfWeek = thisWeek.clone().endOf('week').date();
        let newWeekNumber = Math.ceil(endOfWeek/7);
        setCurrentWeekNumber(newWeekNumber)
        setCurrentWeekMonth(thisWeek.clone().endOf('week').format('MMM'))
      }
  }
  const previousWeek = () => {
    const previousWeek = currentWeek.clone().subtract(1, 'week');
    getWeekDetails(previousWeek);
    setCurrentWeek(previousWeek);
  };

  const nextWeek = () => {
    const nextWeek = currentWeek.clone().add(1, 'week');
    getWeekDetails(nextWeek);
    setCurrentWeek(nextWeek);
  };


  return (
    <div className='calendercontainer'>
      <button className='previ' onClick={previousWeek}><span className="material-icons-outlined">chevron_left</span></button>
      {!isMixedWeek && <p>{currentWeekMonth} - {currentWeek.format('YYYY')} W{currentWeekNumber}</p>} {isMixedWeek && <p>{currentWeekMonth} - {currentWeek.format('YYYY')} - {mixedWeekAnotherMonth} - {currentWeek.format('YYYY')}  </p>}
      <button className='previ' onClick={nextWeek}><span className="material-icons-outlined">chevron_right</span></button>
    </div>
  );
};

export default WeeklyCalendar;
