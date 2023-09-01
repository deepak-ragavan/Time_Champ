import DateRangePickerComp from "./filter/datepicker/dateRangePicker"
import { useEffect, useState } from "react";
import './summary.scss'
import { Range } from 'react-date-range';
import User from "./filter/user/user";
import Piechart from "./chart/piechart";
import CardView from "./cardview/cardview";
import { useSelector, useDispatch } from "react-redux";
import ShowData from "./filter/showData/showData";
import moment from"moment";
import Search from "./filter/search/search";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { selectUserDataReducer, setUserChildData } from "../store/reducer/reducerUserData";
import MultiSelectDropDown from "../common/multiSelectDropDown";

type summaryData = {
    appName:string,
    spentTime:number,
    appIcon:string,
}

type summaryTotalProductivity = {
    productive: number,
    unproductive: number,
    neutral: number,
    deskTime: number
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

const initalState = {
    productive: 0,
    unproductive: 0,
    neutral: 0,
    deskTime: 0,
}

const branchOptions = [
    { label: "Porur", value: "Porur" },
    { label: "Navalur", value: "Navalur" },
    { label: "Bangalore", value: "Bangalore" },
];

const departmentOptions = [
    { label: "Administration ", value: "Administration" },
    { label: "Finance", value: "Finance" },
    { label: "IT", value: "IT" },
    { label: "Sales", value: "Sales" },
];

const roleOptions = [
    { label: "Super Admin", value: "Super-Admin" },
    { label: "Manager", value: "Manager" },
    { label: "Admin", value: "Admin" },
    { label: "Team Lead", value: "Team-Lead" },
    { label: "User", value: "User" },
];


const Summary = () => {
    const [open, setOpen] = useState(false);
    const [filterDropdown, setFilterDropdown] = useState<Array<boolean>>([false, false, false, false,false,false]);
    const [range, setRange] = useState<Range[]>([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
    ]);
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [searchtext,setSearchText] = useState("")
    const userId = useSelector(selectUserDataReducer).id;
    const [productiveData,setProductiveData] = useState<summaryData[]>([]);
    const [unProductiveData,setUnProductiveData] = useState<summaryData[]>([]);
    const [neturalData,setNeturalData] = useState<summaryData[]>([]);
    const [topFiveWebsite,setTopFiveWebsite] = useState<summaryData[]>([]);
    const [chartData,setChartData] = useState<summaryTotalProductivity>(initalState)
    const [selectedUser,setSelectedUser] = useState<userProps | null>(null);
    const [user,setUser] = useState<userProps[] | null>(null);
    const axiosPrivate = useAxiosPrivate();
    const [isFirstTime,setIsFirstTime] = useState<boolean>(true);
    const dispatch = useDispatch();
    const childUserIds = useSelector(selectUserDataReducer).childUsers;

    const fetchSummaryData = async () => {
        try {
            const selectedUserId = selectedUser!==null?selectedUser.id:childUserIds.toString();
            const response = await axiosPrivate.get("/app-activity/status",{params:{userIds:selectedUserId,fromDate:moment(range[0].startDate).format('YYYY-MM-DD'), toDate:moment(range[0].endDate).format('YYYY-MM-DD') ,searchText:searchtext}});
            setProductiveData(response?.data?.productive || []);
            setUnProductiveData(response?.data?.unproductive || []);
            setNeturalData(response?.data?.neutral || []);
            setTopFiveWebsite(response?.data?.topFiveApp || []);
        } catch(error) {
            setProductiveData([])
            setUnProductiveData([]);
            setNeturalData([]);
            setTopFiveWebsite([]);
        }
        fetchSummaryTotalProductivityData();
    }

    const fetchSummaryTotalProductivityData = async () => {
        try {
            console.log(childUserIds)
            const selectedUserId = selectedUser!==null?selectedUser.id:childUserIds.toString();
            const response = await axiosPrivate.get("/app-activity/total-app-activity",{params:{userIds:selectedUserId,fromDate:moment(range[0].startDate).format('YYYY-MM-DD'), toDate:moment(range[0].endDate).format('YYYY-MM-DD')}});
            let chartDataObject = {
                productive : response?.data.productive === null ? 0 : response?.data.productive,
                unproductive : response?.data.unproductive === null ? 0 : response?.data.unproductive,
                neutral : response?.data.neutral === null ? 0 : response?.data.neutral,
                deskTime : response?.data.deskTime === null ? 0 : response?.data.deskTime,
            }
            setChartData(chartDataObject);
        } catch(error) {
            setChartData(initalState);
        }
    }

    const getUserDataForFilter = async () => {
        try {
            const response = await axiosPrivate.get("/users",{params:{userId:userId}});
            setUser(response.data);
        } catch(error) {
            setUser(null)
        }
        getChildUsersIds();
    }

    const getChildUsersIds =async () => {
        try {
            const response = await axiosPrivate.get("/user/getMyTeamMemberIds",{params:{userId:userId}});
            console.log(response.data)
            dispatch(setUserChildData(response.data));
        } catch(error) {
           console.log(error)
        }
        fetchSummaryData();
    }

    useEffect(()=> {
        if(isFirstTime) {
            getUserDataForFilter()
            setIsFirstTime(false)
        } else {
            fetchSummaryData()
        }        
    },[range,selectedUser,searchtext,childUserIds])

    const changefiltericon = () => {
        let icontag = document.getElementById("filtericon")
        if (icontag !== null) {
            if (icontag.innerText === "filter_alt_off") {
                icontag.innerText = "filter_alt"
                setOpen(true)
            } else {
                icontag.innerText = "filter_alt_off"
                setOpen(false)
            }
        }
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

    const resetFilter = () => {
        selectDropDown();
        setRange([
            {
              startDate: new Date(),
              endDate: new Date(),
              key: 'selection'
            }
        ])
        setSearchText("")
        setSelectedBranch('')
        setSelectedDepartment('')
        setSelectedRole('')
        setSelectedUser(null)
    }

    return <div className="summary">
        <div className="filter">
            <ul className="expandfilter">
                <li className="filterlist">
                    <span id="filtericon" onClick={() => { changefiltericon() }} className="material-icons-outlined">filter_alt_off</span>
                </li>
                <li className="filterlist">
                    <button onClick={() => { resetFilter() }} className="restartbutton"><span className="material-icons-outlined filtericonborderleft">restart_alt</span></button>
                </li>
                {open && (
                    <>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(0)} className='downarrow'>
                                <span id="dropdown" className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">Date</span>
                            </button>
                            {filterDropdown[0] && <DateRangePickerComp range={range} setRange={setRange} />}
                        </li>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(1)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">Branch</span>
                            </button>
                            {(filterDropdown[1] === true) && <MultiSelectDropDown selectedOption={selectedBranch} setSelectedOption={setSelectedBranch} options={branchOptions} isShowLabel={false} placeholder="Branch" />}
                        </li>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(2)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">Department</span>
                            </button>
                            {(filterDropdown[2] === true) && <MultiSelectDropDown selectedOption={selectedDepartment} setSelectedOption={setSelectedDepartment} options={departmentOptions} isShowLabel={false} placeholder="Department" />}
                        </li>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(3)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">Role</span>
                            </button>
                            {(filterDropdown[3] === true) && <MultiSelectDropDown  selectedOption={selectedRole} setSelectedOption={setSelectedRole} options={roleOptions} isShowLabel={false} placeholder="Role" />}
                        </li>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(4)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">User</span>
                            </button>
                            {(filterDropdown[4] === true && user ) &&   <User selectedUser={selectedUser} setSelectedUser={setSelectedUser} users={user}/>}
                        </li>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(5)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">Search</span>
                            </button>
                            {(filterDropdown[5] === true) && <Search searchedText={searchtext} setSearchedText={setSearchText}/>}
                        </li>
                    </>
                )}
            </ul>
            <div className="filterDateContainer">
                <div className="showfilterdata">
                    <ShowData dataKey="From Date" value={moment(range[0].startDate).format(`DD MMMM, YYYY`)} setSelected={setRange} />
                    <ShowData dataKey="To Date" value={moment(range[0].endDate).format(`DD MMMM, YYYY`)} setSelected={setRange} />
                    <ShowData dataKey="Branch" value={selectedBranch} setSelected={setSelectedBranch} />
                    <ShowData dataKey="Department" value={selectedDepartment} setSelected={setSelectedDepartment} />
                    <ShowData dataKey="Role" value={selectedRole} setSelected={setSelectedRole} />
                    <ShowData dataKey="User" value={selectedUser!==null?selectedUser.name:""} setSelected={setSelectedUser} />
                    <ShowData dataKey="Search" value={searchtext} setSelected={setSearchText} />
                </div>
            </div>
        </div>
        <div className="summaryData">
            <div className="row1">
                    <Piechart heading="Top 5 Websites & Applications" headingClassName="chartheading1" data={chartData} topFiveApp={topFiveWebsite} />
                    <Piechart heading="Time Productivity" headingClassName="chartheading1" data={chartData} topFiveApp={topFiveWebsite} />
            </div>
            <div className="row2">
                <div className="cardData">
                    <CardView heading="Productive Apps & Websites" headingClassName="cardheading" data={productiveData} />
                </div>
                <div className="cardData">
                    <CardView heading="Unproductive Apps & Websites" headingClassName="cardheading" data={unProductiveData} />
                </div>
                <div className="cardData">
                    <CardView heading="Netural Apps & Websites" headingClassName="cardheading" data={neturalData} />
                </div>
            </div>
        </div>
    </div>

}

export default Summary;