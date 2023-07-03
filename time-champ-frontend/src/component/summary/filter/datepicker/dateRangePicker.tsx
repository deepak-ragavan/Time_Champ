import { useRef, useState,useEffect } from 'react';
import { DateRange, Range } from 'react-date-range';
import { useDispatch } from 'react-redux';
import './dateRangePicker.scss'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { saveFilterDate } from '../../../store/reducer/reducerFilter';

const DateRangeComp: React.FC = () => {
  const dispatch = useDispatch()
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [open, setOpen] = useState(false);
  const refOne = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
      
      // Hide on outside click
      const hideOnClickOutside = (e:any) => {
        // console.log(refOne.current)
        // console.log(e.target)
        if( refOne.current && !refOne.current.contains(e.target) ) {
          setOpen(false)
        }
        const fromDate = range[0]?.startDate ?? new Date();
          const toDate = range[0]?.endDate ?? new Date();
          const formattedFromDate = fromDate.getDate()+" "+fromDate.toLocaleString('default', { month: 'long' })+","+fromDate.getFullYear();
          const formattedToDate = toDate.getDate()+" "+toDate.toLocaleString('default', { month: 'long' })+","+toDate.getFullYear()
          const selectedDate = {
               fromDate : formattedFromDate,
               toDate : formattedToDate
          }
          dispatch(saveFilterDate(selectedDate))
      }
      // event listeners
      document.addEventListener('click', hideOnClickOutside);

      return () => {
        document.removeEventListener('click', hideOnClickOutside);
      };

  }, [dispatch,range])
  
  return (
    <div className="calendarWrap" ref={refOne}>
       <div onClick={() => setOpen(!open)} className='downarrow'>
            <span id="dropdown"   className="material-icons-round dropdown">arrow_drop_down</span>
            <span className="navtext">Date</span>  
        </div>

      <div className='dateRangePicker' >
        {open && (
          <DateRange
            onChange={(item) => setRange([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            direction="horizontal"
            className="calendarElement"
          />
        )}
      </div>
    </div>
  );
};

export default DateRangeComp;
