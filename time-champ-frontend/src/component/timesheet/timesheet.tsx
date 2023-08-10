import { Button } from '@mui/material';
import DateRangePickerComponent from './DateRangePicker';
import './timesheet.scss'
import { useState } from 'react';
import FilterNav from '../navbar/filternav/filterNav';
import { Range } from 'react-date-range';
import TodayDataContainer from './todayDataContainer';
import BarChart from './barChart';

type filterOptions = {
    label:string,
    value:string
} 

const Timesheet = () => {
    const [range, setRange] = useState<Range[]>([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
    ]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [isOpen,setIsOpen] = useState<boolean>(false);
    console.log(isOpen)
    return <div className="timesheet">
        <h2>Attendace</h2>
        <div className='filterContainer'>
            <div className='filterButtonContainer'>
                <DateRangePickerComponent range={range} setRange={setRange}/>
                <Button onClick={() => setIsOpen(true)} className='filterButton' variant="contained">Filter</Button>
            </div>
            <FilterNav isOpen={isOpen} setIsOpen={setIsOpen} selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment}  />
        </div>
        <div className='attendanceDataContainer'>
            <TodayDataContainer/>
        </div>
        <BarChart />
    </div>

}

export default Timesheet;