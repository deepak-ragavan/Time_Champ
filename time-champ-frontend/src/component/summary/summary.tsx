import DateRangePickerComp from "./filter/datepicker/dateRangePicker"
import { useEffect, useState } from "react";
import './summary.scss'
import { Range } from 'react-date-range';
import Branch from "./filter/branch/branch";
import Role from "./filter/role/role";
import User from "./filter/user/user";
import Piechart from "./chart/piechart";
import CardView from "./cardview/cardview";
import { useSelector, useDispatch } from "react-redux";
import Department from "./filter/department/department";
import ShowData from "./filter/showData/showData";
import moment from"moment";
import Search from "./filter/search/search";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { selectTokenProfile } from "../store/reducer/reducerToken";

type summaryData = {
    appName:string,
    spentTime:number,
    appIconUrl:string,
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
    const [selectedBranch, setSelectedBranch] = useState<filterOptions[]>([]);
    const [selectedRole, setSelectedRole] = useState<filterOptions[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<filterOptions[]>([]);
    const [searchtext,setSearchText] = useState("")
    const userId = useSelector(selectTokenProfile).id;
    const [productiveData,setProductiveData] = useState<summaryData[]>([]);
    const [unProductiveData,setUnProductiveData] = useState<summaryData[]>([]);
    const [neturalData,setNeturalData] = useState<summaryData[]>([]);
    const [topFiveWebsite,setTopFiveWebsite] = useState<summaryData[]>([]);
    const [chartData,setChartData] = useState<summaryTotalProductivity>(initalState)
    const [selectedUser,setSelectedUser] = useState<userProps | null>(null);
    const [user,setUser] = useState<userProps[] | null>(null);
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();

    const fetchSummaryData = async () => {
        try {
            const response = await axiosPrivate.get("/app-activity/status",{params:{userId:userId,fromDate:moment(range[0].startDate).format('YYYY-MM-DD'), toDate:moment(range[0].endDate).format('YYYY-MM-DD') ,searchText:searchtext}});
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
            const selectedUserId = selectedUser!==null?selectedUser.id:userId;
            const response = await axiosPrivate.get("/app-activity/total-app-activity",{params:{userId:selectedUserId,fromDate:moment(range[0].startDate).format('YYYY-MM-DD'), toDate:moment(range[0].endDate).format('YYYY-MM-DD')}});
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
        fetchSummaryData();
    }

    useEffect(()=> {
        getUserDataForFilter();
    },[range,selectedUser,searchtext])

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
        setSelectedBranch([])
        setSelectedDepartment([])
        setSelectedRole([])
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
                            {(filterDropdown[1] === true) && <Branch selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} />}
                        </li>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(2)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">Department</span>
                            </button>
                            {(filterDropdown[2] === true) && <Department selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} />}
                        </li>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(3)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">Role</span>
                            </button>
                            {(filterDropdown[3] === true) && <Role  selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>}
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
                    <ShowData dataKey="Branch" value={selectedBranch.map((val: filterOptions) => val.value).toString()} setSelected={setSelectedBranch} />
                    <ShowData dataKey="Department" value={selectedDepartment.map((val: filterOptions) => val.value).toString()} setSelected={setSelectedDepartment} />
                    <ShowData dataKey="Role" value={selectedRole.map((val: filterOptions) => val.value).toString()} setSelected={setSelectedRole} />
                    <ShowData dataKey="User" value={selectedUser!==null?selectedUser.name:""} setSelected={setSelectedUser} />
                    <ShowData dataKey="Search" value={searchtext} setSelected={setSearchText} />
                </div>
            </div>
        </div>
        <div className="summaryData">
            <div className="row1">
                    <Piechart heading="Top 5 Websites & Applications" headingClassName="chartheading1" data={chartData} topFiveApp={topFiveWebsite} />
                    <Piechart heading="Time Productivity" headingClassName="chartheading2" data={chartData} topFiveApp={topFiveWebsite} />
            </div>
            <div className="row2">
                <div className="cardData">
                    <CardView heading="Productive Apps & Websites" headingClassName="cardheading" data={productiveData} />
                </div>
                <div className="cardData">
                    <CardView heading="Unproductive Apps & Websites" headingClassName="cardheading1" data={unProductiveData} />
                </div>
                <div className="cardData">
                    <CardView heading="Netural Apps & Websites" headingClassName="cardheading2" data={neturalData} />
                </div>
            </div>
        </div>
    </div>

}

export default Summary;