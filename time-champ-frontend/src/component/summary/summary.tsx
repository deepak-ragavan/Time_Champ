import DateRangePickerComp from "./filter/datepicker/dateRangePicker"
import { useEffect, useState } from "react";
import './summary.scss'
import Branch from "./filter/branch/branch";
import Role from "./filter/role/role";
import User from "./filter/user/user";
import Piechart from "./chart/piechart";
import CardView from "./cardview/cardview";
import { useSelector,useDispatch } from "react-redux";
import { loadFilterData, removeFilterData, selectFilterData } from "../store/reducer/reducerFilter";
import Department from "./filter/department/department";
import ShowData from "./filter/showData/showData";

const Summary = () => {
    const [open, setOpen] = useState(false);
    const filterData = useSelector(selectFilterData)
    const dispatch = useDispatch();
    const changefiltericon = () => {
        let icontag = document.getElementById("filtericon")
        if(icontag!==null) {
            if(icontag.innerText==="filter_alt_off") {
                icontag.innerText = "filter_alt"
                setOpen(true)
            } else {
                icontag.innerText = "filter_alt_off"
                setOpen(false)
            }
        }
    }

    useEffect(() => {
        dispatch(loadFilterData());
    },[dispatch])

    const resetFilter = () => {
        dispatch(removeFilterData())
    }

    return <div className="summary">
            <div className="filter">
                <ul className="expandfilter">
                    <li className="filterlist">
                        <span id="filtericon" onClick={() => {changefiltericon()}} className="material-icons-outlined">filter_alt_off</span>
                    </li>
                    <li className="filterlist">
                        <button onClick={() => {resetFilter()}} className="restartbutton"><span className="material-icons-outlined filtericonborderleft">restart_alt</span></button>
                    </li>
                    {open && (
                        <>
                            <li className="filterlist"><DateRangePickerComp /></li>
                            <li className="filterlist"><Branch/></li>
                            <li className="filterlist"><Department/></li>
                            <li className="filterlist"><Role/></li>
                            <li className="filterlist"><User/></li>
                        </>
                    )}
                </ul>
                <div className="filterDateContainer">
                    <div className="showfilterdata">
                       <ShowData dataKey="From Date" value={filterData.fromDate}/>
                       <ShowData dataKey="To Date" value={filterData.toDate}/>
                       <ShowData dataKey="Department" value={filterData.department.toString()}/>
                       <ShowData dataKey="Branch" value={filterData.branch.toString()}/>
                       <ShowData dataKey="Role" value={filterData.role.toString()}/>
                    </div>
                </div>
            </div>
            <div className="summaryData">
                <div className="row1">
                    <div className="chart">
                        <Piechart heading="Top 5 Websites & Applications" headingClassName="chartheading1"/>
                    </div>
                    <div className="chart">
                        <Piechart heading="Time Productivity" headingClassName="chartheading2"/>
                    </div>
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