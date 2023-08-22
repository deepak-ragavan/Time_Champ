import { Button } from '@mui/material';
import DateRangePickerComponent from './DateRangePicker';
import './attendance.scss'
import { useEffect, useMemo, useState } from 'react';
import FilterNav from '../navbar/filternav/filterNav';
import { Range } from 'react-date-range';
import TodayDataContainer from './todayDataContainer';
import BarChart from './barChart';
import { useSelector } from 'react-redux';
import { selectTokenProfile } from '../store/reducer/reducerToken';
import TableDataComponent from './tableDataComponent';
import moment from 'moment';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Value } from 'sass';
import { formatTimeForAttendaceTable } from '../helper/helper';

type dateRangeData = {
    id: number,
    name: string,
    employeeId: string,
	timeLine:timeLineData[]
}
    
type timeLineData = {
	date:string,
	time:number | number    
}

interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right';
    isDisable:boolean
}

type userActivity = {
    id: number,
    startTime: string,
    endTime: string,
    spentTime: number,
    reason: string,
    workingStatus: string,
    activityStatus: string,
    status: string
}

type userProps = {
    id: number,
    name: string,
    role: string
}



type attendaceData = {
    id: number,
    name:string,
    startTime: string,
    endTime: string,
    idle: number,
    working: number,
    nonWorking: number,
    breakTime: number,
    totalTime: number,
    productive: number,
    unproductive: number,
    neutral: number,
    deskTime: number,
    userActivity: userActivity[]
}

const initialUser = {
    id:0,
    name:"",
    role:""
}


const getDateRangeArray = (dateRangeData:dateRangeData[],setComlumns:(value:Column[])=>void,setRows:(Value:any[])=>void,setLastRow:(Value:any)=>void) => {
    let columns: Column[] = [
        { id: 'ID', label: 'ID', minWidth: 170, isDisable: false },
        { id: 'Name', label: 'Name', minWidth: 100, isDisable: false },
        {
          id: 'Expected_Hours',
          label: 'Expected Hours',
          minWidth: 170,
          align: 'right',
          isDisable: false
        },
        {
            id: 'Actual_Hours',
            label: 'Actual Hours',
            minWidth: 170,
            align: 'right',
            isDisable: false
        },
    ];
    let totalActualTime = 0;
    let attendaceRowData:any = [] 
    let isFirstTime = true;
    dateRangeData.forEach((emp) => {
        let rowDataObject:any = {}; 
        emp.timeLine.forEach((data) => {
            if(isFirstTime) {
                const dateColumn:Column = {
                    id: moment(data.date).format('DD MMM YYYY'),
                    label: moment(data.date).format('DD MMM YYYY'),
                    minWidth: 170,
                    align: 'right',
                    isDisable: data.time === null ? true : false
                }
                columns.push(dateColumn)
            }
            const time = data.time===null ? 0 : data.time;
            const key = moment(data.date).format('DD MMM YYYY');
            rowDataObject[key] = time;
            totalActualTime+=data.time === null ? 0 : data.time;
        })
        rowDataObject["ID"] = emp.id;
        rowDataObject["Name"] = emp.name;
        rowDataObject["Expected_Hours"] = emp.timeLine.length*8;
        rowDataObject["Actual_Hours"] = totalActualTime > 0 ? totalActualTime : 0;
        attendaceRowData.push(rowDataObject);
        isFirstTime = false
    })
    console.log(attendaceRowData)
    setRows(attendaceRowData)
    setComlumns(columns)
    getLastTotalRowValue(attendaceRowData,setLastRow)
    console.log(attendaceRowData)
}


const getLastTotalRowValue = (rowDate:any[],setLastRow:(Value:any)=>void) => {
    const dateWiseTotals:any = {};
    rowDate.forEach(item => {
    Object.keys(item).forEach(key => {
        if (key !== 'ID' && key !== 'Name') {
        dateWiseTotals[key] = (dateWiseTotals[key] || 0) + item[key];
        }
    });
    });
    dateWiseTotals["ID"] = "Total Hours"
    setLastRow(dateWiseTotals);
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
    const userId = useSelector(selectTokenProfile).id;
    const [data,setData] = useState<attendaceData[] | null>(null)
    const [dateRangeData,setDateRangeData] = useState<dateRangeData[]>([])
    const [selectedUser,setSelectedUser] = useState<userProps>(initialUser);
    const [user,setUser] = useState<userProps[]>([]);
    const [columns,setComlumns] = useState<Column[]>([]);
    const [rows,setRows] = useState<any[]>([]);
    const [lastRow,setLastRow] = useState<any>({});
    const isNotDateRange = useMemo(()=>{
        return range[0].startDate?.toDateString()===range[0].endDate?.toDateString();
    },[range])
    const axiosPrivate = useAxiosPrivate();

    useEffect(()=> {
        const getDateRangeData = async () => {
            try {
                const response = await axiosPrivate.get("/user-attendance/monthly-attendance",{params:{fromDate:moment(range[0].startDate).format("YYYY-MM-DD"),toDate:moment(range[0].endDate).format("YYYY-MM-DD"),activity:"working",userId:"1,2,3"}})
                getDateRangeArray(response.data,setComlumns,setRows,setLastRow)
            } catch(error) {
                setDateRangeData([])
            }
        }
        if(range[0].startDate!==range[0].endDate) {
            getDateRangeData();
        }
        
    },[range])
    return <div className="timesheet">
        <div className='filterContainer'>
            <div className='filterButtonContainer'>
                <DateRangePickerComponent range={range} setRange={setRange}/>
                <Button onClick={() => setIsOpen(true)} className='filterButton' variant="contained">Filter</Button>
            </div>
            <FilterNav isOpen={isOpen} setIsOpen={setIsOpen} selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment}  />
        </div>
        <div className='attendanceContainer'>
            {
                isNotDateRange &&
                    <div className="UsersList">
                        <h4>Users</h4>
                        {
                            data && data.map((value) => (
                                <div className="users" id={value.id.toString()} onClick={()=>{setSelectedUser(user.find((user:userProps)=>user.id===value.id)!)}}>
                                    <button className={value.name===selectedUser.name ? "usersButton Active" : "usersButton inActive" } >{value.name}</button>
                                </div>
                            ))
                        }
                    </div>
            }
            <div className={isNotDateRange ? 'attendanceDataContainer' : 'attendanceDataContainer dateRange' }>
                {
                    isNotDateRange
                                ? ( <>
                                        <TodayDataContainer/>
                                        <div className='chartData'>
                                            <BarChart />
                                        </div>
                                    </> ) 
                                : (
                                    <TableDataComponent columns={columns} rows={rows} lastRow={lastRow} />
                                )
                }
                
               
            </div>
        </div>
        
    </div>

}

export default Timesheet;