import { useRef, useState,useEffect } from 'react';
import { DateRange, Range } from 'react-date-range';
import { useDispatch, useSelector } from 'react-redux';
import './dateRangePicker.scss'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { saveFilterDate, selectFilterData } from '../../../store/reducer/reducerFilter';


const DateRangeComp: React.FC = () => {
  const dispatch = useDispatch()
  const filterData = useSelector(selectFilterData)
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const refOne = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
      
  //     // Hide on outside click
  //     const hideOnClickOutside = (e:any) => {
  //       // console.log(refOne.current)
  //       // console.log(e.target)
  //       // if( refOne.current && !refOne.current.contains(e.target) ) {
  //       //   setOpen(false)
  //       // }
  //       const fromDate = range[0]?.startDate ?? new Date();
  //         const toDate = range[0]?.endDate ?? new Date();
  //         const formattedFromDate = fromDate.getDate()+" "+fromDate.toLocaleString('default', { month: 'long' })+","+fromDate.getFullYear();
  //         const formattedToDate = toDate.getDate()+" "+toDate.toLocaleString('default', { month: 'long' })+","+toDate.getFullYear()
  //         const selectedDate = {
  //              fromDate : formattedFromDate,
  //              toDate : formattedToDate
  //         }
  //         dispatch(saveFilterDate(selectedDate))
  //     }
  //     // event listeners
  //     document.addEventListener('click', hideOnClickOutside);

  //     return () => {
  //       document.removeEventListener('click', hideOnClickOutside);
  //     };

  // }, [range])

  // useEffect(() => {
  //   if (filterData.isresetFilter) {
  //     setRange([
  //       {
  //         startDate: new Date(),
  //         endDate: new Date(),
  //         key: 'selection'
  //       }
  //     ]);
  //   }
  // }, [filterData.isresetFilter]);

  

  const saveData = (item:Range[]) => {
    setRange(item)
    // moment(item[0]?.startDate).format(`DD MMMM, YYYY`)
    // moment(item[0]?.endDate).format(`DD MMMM, YYYY`)
    const selectedDate = {
      fromDate :  item[0].startDate,
      toDate :  item[0].endDate
    }
    dispatch(saveFilterDate(selectedDate))
  }

  useEffect(()=>{
    if(filterData.fromDate && filterData.toDate){
      setRange([{
        startDate: filterData.fromDate,
        endDate: filterData.toDate,
        key: 'selection'
      }])
    }

  },[filterData])
  
  return (
    <div className="calendarWrap" ref={refOne}>
      <div className='dateRangePicker'>
          <DateRange
            onChange={(item) => saveData([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            direction="horizontal"
            className="calendarElement"
          />
      </div>
    </div>
  );
};

export default DateRangeComp;
