import { Button } from '@mui/material';
import './myDashboard.scss'
import { useEffect, useState } from 'react';
import FilterNav from '../navbar/filternav/filterNav';
import TodayDataContainer from './todayDataContainer';
import KeyStrokeChart from './keyStrokeChart';
import AppListChart from './appListChart'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useSelector } from 'react-redux';
import { selectUserDataReducer } from '../store/reducer/reducerUserData';
import moment from 'moment';
import DatePicker from '../common/datePicker';


const initalState = {
    productive: 0,
    unproductive: 0,
    neutral: 0,
    deskTime: 0,
}

type userProps = {
    id: number,
    name: string,
    role: string
}

const initialUser = {
    id:0,
    name:"",
    role:""
}

type dashData ={
    id: number,
    startTime: string,
    endTime: string,
    idle: number,
    working: number,
    breakTime: number,
    totalTime: number,
    productive: number,
    unproductive: number,
    neutral: number,
    deskTime: number
}


const MyDashboard = () => {
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [selectedUser,setSelectedUser] = useState<userProps>(initialUser);
    const [todayData,setTodayData] = useState<dashData | null>(null)
    const axiosPrivate = useAxiosPrivate();
    const [presentMoment, setPresentMoment] = useState(moment().format("ddd, MMM DD, YYYY"));
    const userData = useSelector(selectUserDataReducer);
    const users = userData.childUsersDetails;
    const userId = userData.id;
    const fetchData = async () => {
        try {
          const selectedUserId = selectedUser.id !== 0 ? selectedUser.id : userId;
          const response = await axiosPrivate.get('/user-attendance/getUserAttendanceDetails',{params:{userId:selectedUserId,date:moment(new Date(presentMoment)).format("YYYY-MM-DD")}});
          console.log(response.data)
          setTodayData(response.data)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData();
      }, [presentMoment,selectedUser]);

    return <div className="dashboard">
        <div className='filterContainer'>
            <div className='filterButtonContainer'>
                <DatePicker  presentMoment={presentMoment} setPresentMoment={setPresentMoment}  />
                <Button onClick={() => setIsOpen(true)} className='filterButton' variant="contained">Filter</Button>
            </div>
            <FilterNav isOpen={isOpen} setIsOpen={setIsOpen} selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} selectedUser={selectedUser} setSelectedUser={setSelectedUser} users={users} />
        </div>
       
        <div className='dashMain'>
        <div className='dashCardContainer'>
             <TodayDataContainer todayData={todayData}/> 
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