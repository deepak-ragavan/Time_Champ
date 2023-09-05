import './productivity.scss'
import WeeklyCalendar from "./weeklyDataFilter/weeklyDataFilter"
import { useEffect, useState } from 'react'
import User from '../summary/filter/user/user'
import LineManager from './lineManager'
import DataTable from './dataTable'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useSelector } from 'react-redux'
import { selectUserDataReducer } from '../store/reducer/reducerUserData'
import moment from 'moment'
import ShowData from '../summary/filter/showData/showData'
import MultiSelectDropDown from '../common/multiSelectDropDown'

type productivity = {
    name:string,
    id:number,
    productivity:productivityDataType[]
}

type productivityDataType = {
    productive:number,
    unproductive:number,
    neutral:number,
    idle:number,
    working: number,
    date:string,
    startTime:string,
    endTime: string,
}

type userProps = {
    id: number,
    name: string,
    role: string
}

type filterOptions = {
    label:string,
    value:string
}

const roleOptions = [
    { label: "Super Admin", value: "Super-Admin" },
    { label: "Manager", value: "Manager" },
    { label: "Admin", value: "Admin" },
    { label: "Team Lead", value: "Team-Lead" },
    { label: "User", value: "User" },
];

const Productivity = () => {
    const [currentWeek, setCurrentWeek] = useState(moment());
    const [filterDropdown, setFilterDropdown] = useState<Array<boolean>>([false,false,false])
    const axiosPrivate = useAxiosPrivate();
    const [data,setData] = useState<productivity[] | null>(null)
    const [showIdleTimeData,setShowIdleTimeData] = useState(false);
    const [selectedUser,setSelectedUser] = useState<userProps | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedLineManager,setSelectedLineManager] = useState<filterOptions[]>([]);
    const userData = useSelector(selectUserDataReducer);
    const childUserIds = userData.childUsers;
    const users = userData.childUsersDetails
    const userId = userData.id;

    useEffect(()=> {
        getProductivityData()
    },[currentWeek])
      

    const showIdleTime = () => {
        console.log("insideeeshowIdle")
        setShowIdleTimeData(!showIdleTimeData)
    }

    const getProductivityData = async () => {
        try {
             const selectedUserId = childUserIds.toString();
             const response = await axiosPrivate.get("/user-attendance/productivity",{params:{userIds:selectedUserId,fromDate:currentWeek.clone().startOf('week').format('YYYY-MM-DD'),toDate:currentWeek.clone().endOf('week').format('YYYY-MM-DD')}});
             const productivityData = response?.data
             setData(productivityData);
       } catch(error) {
            setData(null);
       }
        const selectedUserId = selectedUser && selectedUser.id !== 0 ? selectedUser.id : userId;
        const selected = users.find((user)=>user.id===selectedUserId);
        setSelectedUser(selected !== undefined ? selected : null)
    }

    const selectDropDown = (selctedOne?: number) => {
        filterDropdown.forEach((e, index) => {
            if (selctedOne !== null && index === selctedOne) {
                filterDropdown[index] = filterDropdown[index] === false ? true : false;
            } else {
                filterDropdown[index] = false;
            }
        })
        setFilterDropdown([...filterDropdown]);
    }

    return (
    <div className="productivity">
        <div className="productivityFilter">
            <div className=''>
                <ul className="expandfilter">
                    <li className="filterlist">
                        <button onClick={() => selectDropDown(0)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">Role</span>
                        </button>
                        {(filterDropdown[0] === true) && <MultiSelectDropDown  selectedOption={selectedRole} setSelectedOption={setSelectedRole} options={roleOptions} isShowLabel={false} placeholder="Role" />}
                    </li>
                    <li className="filterlist">
                        <button onClick={() => selectDropDown(1)} className='downarrow'>
                                <span className="navtext">Line Manager</span>
                        </button>
                        {(filterDropdown[1] === true) && <LineManager selectedLineManager={selectedLineManager} setSelectedLineManager={setSelectedLineManager}/>}
                    </li>
                    <li className="filterlist">
                        <button onClick={() => selectDropDown(2)} className='downarrow'>
                                <span className="navtext">User</span>
                        </button>
                        {(filterDropdown[2] === true && users ) &&   <User selectedUser={selectedUser} setSelectedUser={setSelectedUser} users={users}/>}
                    </li>
                </ul>  
            </div>
            <div className="weeklyCalender">
                <WeeklyCalendar currentWeek={currentWeek} setCurrentWeek={setCurrentWeek}/>
            </div>
            <div className='settings'>
                <button>
                <span className="material-icons-outlined">refresh</span>
                </button>
                <button>
                <span className="material-icons-round">file_download</span>
                </button>
                <span>Include idle time</span>
                <label  className="switch">
                    <input onClick={showIdleTime} type="checkbox" />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
        <div className="filterDateContainer">
                    <div className="showfilterdata">
                        <ShowData dataKey="Role" value={selectedRole} setSelected={setSelectedRole} />
                        <ShowData dataKey="LineManager" value={selectedLineManager.map((val: filterOptions) => val.value).toString()} setSelected={setSelectedLineManager} />
                    </div>
                </div> 
        <div className='productivityDataContainer'>
             {data && selectedUser && users ? <DataTable datas={data} showIdleTimeData={showIdleTimeData} selectedUserDropDown={selectedUser} setSelectedUserDropDown={setSelectedUser} users={users} /> : <div>Loading...</div>}
        </div>

    </div>
    )
}

export default Productivity;