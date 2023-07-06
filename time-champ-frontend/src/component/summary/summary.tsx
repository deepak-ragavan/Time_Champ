import DateRangePickerComp from "./filter/datepicker/dateRangePicker"
import { useEffect, useState } from "react";
import './summary.scss'
import Branch from "./filter/branch/branch";
import Role from "./filter/role/role";
import User from "./filter/user/user";
import Piechart from "./chart/piechart";
import CardView from "./cardview/cardview";
import { useSelector, useDispatch } from "react-redux";
import { loadFilterData, removeFilterData, selectFilterData } from "../store/reducer/reducerFilter";
import Department from "./filter/department/department";
import ShowData from "./filter/showData/showData";
import moment from"moment";
import Search from "./filter/search/search";

const Summary = () => {
    const [open, setOpen] = useState(false);
    const [filterDropdown, setFilterDropdown] = useState<Array<boolean>>([false, false, false, false,false,false])
    const filterData = useSelector(selectFilterData)
    const dispatch = useDispatch();
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

    useEffect(() => {
        dispatch(loadFilterData());
    }, [])

    const resetFilter = () => {
        selectDropDown();
        dispatch(removeFilterData())
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
                            {filterDropdown[0] && <DateRangePickerComp />}
                        </li>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(1)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">Branch</span>
                            </button>
                            {(filterDropdown[1] === true) && <Branch />}
                        </li>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(2)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">Department</span>
                            </button>
                            {(filterDropdown[2] === true) && <Department />}
                        </li>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(3)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">Role</span>
                            </button>
                            {(filterDropdown[3] === true) && <Role />}
                        </li>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(4)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">User</span>
                            </button>
                            {(filterDropdown[4] === true) && <User />}
                        </li>
                        <li className="filterlist">
                            <button onClick={() => selectDropDown(5)} className='downarrow'>
                                <span className="material-icons-round dropdown">arrow_drop_down</span>
                                <span className="navtext">Search</span>
                            </button>
                            {(filterDropdown[5] === true) && <Search />}
                        </li>
                    </>
                )}
            </ul>
            <div className="filterDateContainer">
                <div className="showfilterdata">
                    <ShowData dataKey="From Date" value={moment(filterData.fromDate).format(`DD MMMM, YYYY`)} />
                    <ShowData dataKey="To Date" value={moment(filterData.toDate).format(`DD MMMM, YYYY`)} />
                    <ShowData dataKey="Branch" value={filterData.branch.toString()} />
                    <ShowData dataKey="Department" value={filterData.department.toString()} />
                    <ShowData dataKey="Role" value={filterData.role.toString()} />
                    <ShowData dataKey="Search" value={filterData.search} />
                </div>
            </div>
        </div>
        <div className="summaryData">
            <div className="row1">
                    <Piechart heading="Top 5 Websites & Applications" headingClassName="chartheading1" />
                    <Piechart heading="Time Productivity" headingClassName="chartheading2" />
            </div>
            <div className="row2">
                <div className="cardData">
                    <CardView heading="Productive Apps & Websites" headingClassName="cardheading" />
                </div>
                <div className="cardData">
                    <CardView heading="Unproductive Apps & Websites" headingClassName="cardheading1" />
                </div>
                <div className="cardData">
                    <CardView heading="Netural Apps & Websites" headingClassName="cardheading2" />
                </div>
            </div>
        </div>
    </div>

}

export default Summary;