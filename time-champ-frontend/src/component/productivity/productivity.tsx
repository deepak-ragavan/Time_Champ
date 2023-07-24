import './productivity.scss'
import WeeklyCalendar from "./weeklyDataFilter/weeklyDataFilter"
import Role from '../summary/filter/role/role'
import { useEffect, useState } from 'react'
import User from '../summary/filter/user/user'
import LineManager from './lineManager'
import DataTable from './dataTable'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useSelector } from 'react-redux'
import { selectTokenProfile } from '../store/reducer/reducerToken'
import moment from 'moment'
import ShowData from '../summary/filter/showData/showData'

type productivity = {
    name:string,
    productivity:productivityDataType[]
}

type productivityDataType = {
    Productive:number,
    Unproductive:number,
    Neutral:number,
    Idle:number,
    Working: number,
    StartTime:string,
    EndTime: string,
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

const Productivity = () => {
    const [currentWeek, setCurrentWeek] = useState(moment());
    const [filterDropdown, setFilterDropdown] = useState<Array<boolean>>([false,false,false])
    const axiosPrivate = useAxiosPrivate();
    const userId = useSelector(selectTokenProfile).id;
    const [data,setData] = useState<productivity[] | null>(null)
    const [showIdleTimeData,setShowIdleTimeData] = useState(false);
    const [selectedUser,setSelectedUser] = useState<userProps | null>(null);
    const [selectedRole, setSelectedRole] = useState<filterOptions[]>([]);
    const [selectedLineManager,setSelectedLineManager] = useState<filterOptions[]>([]);
    const [user,setUser] = useState<userProps[] | null>(null);
    

    useEffect(()=> {
        getProductivityData()
        console.log("insideUseEffevct")
    },[currentWeek])


    const getArrayOfWeekDates = () => {
        const fromDate = currentWeek.clone().startOf('week')
        const toDate = currentWeek.clone().endOf('week')
        const datesOfWeek = [];
        let currentDate = fromDate;
        while (currentDate <= toDate) {
          datesOfWeek.push(currentDate.format('YYYY-MM-DD'));
          currentDate = currentDate.clone().add(1, 'day');
        }
        return datesOfWeek;
      }
      const weekDatesArray = getArrayOfWeekDates();
      

    const getUserDataForFilter = async () => {
        try {
            const response = await axiosPrivate.get("/users",{params:{userId:userId}});
            setUser(response.data);
        } catch(error) {
            setUser(null)
        }
    }

    const showIdleTime = () => {
        console.log("insideeeshowIdle")
        setShowIdleTimeData(!showIdleTimeData)
    }

    const getProductivityData = async () => {
        try {
            const fromDate = currentWeek.clone().startOf('week').toDate()
            const toDate = currentWeek.clone().endOf('week').toDate()
             const response = await axiosPrivate.get("/user-attendance/productivity",{params:{userId:userId,fromDate:moment(fromDate).format('YYYY-MM-DD'), toDate:moment(toDate).format('YYYY-MM-DD')}});
             const productivityData = response?.data
             setData(productivityData);
       } catch(error) {
            setData(null);
       }
       getUserDataForFilter()
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
    console.log(data)
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
                        {(filterDropdown[0] === true) && <Role  selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>}
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
                        {(filterDropdown[2] === true && user ) &&   <User selectedUser={selectedUser} setSelectedUser={setSelectedUser} users={user}/>}
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
                        <ShowData dataKey="Role" value={selectedRole.map((val: filterOptions) => val.value).toString()} setSelected={setSelectedRole} />
                        <ShowData dataKey="LineManager" value={selectedLineManager.map((val: filterOptions) => val.value).toString()} setSelected={setSelectedLineManager} />
                        <ShowData dataKey="User" value={selectedUser!==null?selectedUser.name:""} setSelected={setSelectedUser} />
                    </div>
                </div> 
        <div className='productivityDataContainer'>
             {data ? <DataTable datas={data} showIdleTimeData={showIdleTimeData} weekDatesArray={weekDatesArray} /> : <div>Loading...</div>}
        </div>

    </div>
    )
}

export default Productivity;