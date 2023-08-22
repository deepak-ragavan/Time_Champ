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
        <div className='filterContainer'>
            <div className='filterButtonContainer'>
                <DateRangePickerComponent range={range} setRange={setRange}/>
                <Button onClick={() => setIsOpen(true)} className='filterButton' variant="contained">Filter</Button>
            </div>
            <FilterNav isOpen={isOpen} setIsOpen={setIsOpen} selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment}  />
        </div>
       
        <div className='dashMain'>
        <div className='dashCardContainer'>
            <TodayDataContainer/>
        </div>
        <KeyStrokeChart/>
        <AppListChart  heading="Top 5 Websites & Applications" headingClassName="chartheading1" data={initalState} topFiveApp={[]}/>
        </div>
    </div>

}

export default MyDashboard;


// (
//     <div className="productivity">
//         <div className="productivityFilter">
//             <div className=''>
//                 <ul className="expandfilter">
//                     <li className="filterlist">
//                         <button onClick={() => selectDropDown(0)} className='downarrow'>
//                                 <span className="material-icons-round dropdown">arrow_drop_down</span>
//                                 <span className="navtext">Role</span>
//                         </button>
//                         {(filterDropdown[0] === true) && <Role  selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>}
//                     </li>
//                     <li className="filterlist">
//                         <button onClick={() => selectDropDown(1)} className='downarrow'>
//                                 <span className="navtext">Line Manager</span>
//                         </button>
//                         {(filterDropdown[1] === true) && <LineManager selectedLineManager={selectedLineManager} setSelectedLineManager={setSelectedLineManager}/>}
//                     </li>
//                     <li className="filterlist">
//                         <button onClick={() => selectDropDown(2)} className='downarrow'>
//                                 <span className="navtext">User</span>
//                         </button>
//                         {(filterDropdown[2] === true && user ) &&   <User selectedUser={selectedUser} setSelectedUser={setSelectedUser} users={user}/>}
//                     </li>
//                 </ul>  
//             </div>
//             <div className="weeklyCalender">
//                 <WeeklyCalendar currentWeek={currentWeek} setCurrentWeek={setCurrentWeek}/>
//             </div>
//             <div className='settings'>
//                 <button>
//                 <span className="material-icons-outlined">refresh</span>
//                 </button>
//                 <button>
//                 <span className="material-icons-round">file_download</span>
//                 </button>
//                 <span>Include idle time</span>
//                 <label  className="switch">
//                     <input onClick={showIdleTime} type="checkbox" />
//                     <span className="slider round"></span>
//                 </label>
//             </div>
//         </div>
//         <div className="filterDateContainer">
//                     <div className="showfilterdata">
//                         <ShowData dataKey="Role" value={selectedRole.map((val: filterOptions) => val.value).toString()} setSelected={setSelectedRole} />
//                         <ShowData dataKey="LineManager" value={selectedLineManager.map((val: filterOptions) => val.value).toString()} setSelected={setSelectedLineManager} />
//                     </div>
//                 </div> 
//         <div className='productivityDataContainer'>
//              {data && selectedUser && user ? <DataTable datas={data} showIdleTimeData={showIdleTimeData} selectedUserDropDown={selectedUser} setSelectedUserDropDown={setSelectedUser} users={user} /> : <div>Loading...</div>}
//         </div>

//     </div>
//     )