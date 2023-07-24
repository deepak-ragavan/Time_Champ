import { useRef } from 'react';
import { DateRange, Range } from 'react-date-range';
import './dateRangePicker.scss'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangeComp: React.FC<{range:Range[],setRange:(val:Range[])=>void}> = ({range,setRange}) => {

  const refOne = useRef<HTMLDivElement | null>(null);
  
  return (
    <div className="calendarWrap" ref={refOne}>
      <div className='dateRangePicker'>
          <DateRange
            onChange={item => setRange([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            direction="horizontal"
            className="calendarElement"
          />
      </div>
    </div>
  );
};

export default DateRangeComp;
