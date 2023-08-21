import { Button } from '@mui/material';
import DateRangePickerComponent from './DateRangePicker';
import './myDashboard.scss'
import { useState } from 'react';
import FilterNav from '../navbar/filternav/filterNav';
import { Range } from 'react-date-range';
import TodayDataContainer from './todayDataContainer';
import KeyStrokeChart from './keyStrokeChart';
import AppListChart from './appListChart'

type filterOptions = {
    label:string,
    value:string
} 
const initalState = {
    productive: 0,
    unproductive: 0,
    neutral: 0,
    deskTime: 0,
}

const MyDashboard = () => {
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
    return <div className="dashboard">
        <h2>Dashboard</h2>
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
        <KeyStrokeChart/>
        <AppListChart  heading="Top 5 Websites & Applications" headingClassName="chartheading1" data={initalState} topFiveApp={[]}/>
    </div>

}

export default MyDashboard;