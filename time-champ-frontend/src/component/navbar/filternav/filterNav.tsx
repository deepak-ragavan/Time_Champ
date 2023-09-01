import React, { useEffect, useState } from "react"
import './filterNav.scss'
import CloseIcon from '@mui/icons-material/Close';
import User from "../../summary/filter/user/user";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { get } from "http";
import { selectUserDataReducer } from "../../store/reducer/reducerUserData";
import { useSelector } from "react-redux";
import MultiSelectDropDown from "../../common/multiSelectDropDown";

type filterOptions = {
    label:string,
    value:string
} 

type userProps = {
    id: number,
    name: string,
    role: string
}

const FilterNav: React.FC<{isOpen:boolean, setIsOpen:(val:boolean)=>void, selectedDepartment:string,setSelectedDepartment:(val:string)=>void, selectedUser:userProps, setSelectedUser:(val:userProps)=>void, users:userProps[]}> = ({isOpen, setIsOpen, selectedDepartment, setSelectedDepartment, selectedUser, setSelectedUser, users}) => {
    const options = [
        { label: "Administration ", value: "Administration" },
        { label: "Finance", value: "Finance" },
        { label: "IT", value: "IT" },
        { label: "Sales", value: "Sales" },
    ];

    return <div className={isOpen ? "filterNavContainer" : "filterNavContainer Active" }>
        <div className="filterCloseIcon" onClick={()=>setIsOpen(false)}><CloseIcon /></div>
        <div className="filterList">
            {/* <label>Department</label>
            <Department selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} /> */}
            <MultiSelectDropDown selectedOption={selectedDepartment} setSelectedOption={setSelectedDepartment} options={options} isShowLabel={true} placeholder=""/>
        </div>
        <div className="filterList">
            { users &&   <User selectedUser={selectedUser} setSelectedUser={setSelectedUser} users={users}/>}
        </div>
        
    </div>
}

export default FilterNav;