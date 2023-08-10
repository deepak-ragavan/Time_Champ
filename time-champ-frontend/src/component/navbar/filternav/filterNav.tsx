import React, { useEffect, useState } from "react"
import './filterNav.scss'
import Department, {  } from "../../summary/filter/department/department"
import CloseIcon from '@mui/icons-material/Close';
import User from "../../summary/filter/user/user";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { get } from "http";
import { selectTokenProfile } from "../../store/reducer/reducerToken";
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

const FilterNav: React.FC<{isOpen:boolean, setIsOpen:(val:boolean)=>void, selectedDepartment:string,setSelectedDepartment:(val:string)=>void}> = ({isOpen, setIsOpen, selectedDepartment, setSelectedDepartment}) => {
    const [user,setUser] = useState<userProps[] | null>(null);
    const [selectedUser,setSelectedUser] = useState<userProps | null>(null);
    const axiosPrivate = useAxiosPrivate();
    const userId = useSelector(selectTokenProfile).id;
    const options = [
        { label: "Administration ", value: "Administration" },
        { label: "Finance", value: "Finance" },
        { label: "IT", value: "IT" },
        { label: "Sales", value: "Sales" },
      ];

    const getUserDataForFilter = async () => {
        try {
            const response = await axiosPrivate.get("/users",{params:{userId:userId}});
            setUser(response.data);
        } catch(error) {
            setUser(null)
        }
    }

    useEffect(() =>{ 
        getUserDataForFilter()
    },[])

    return <div className={isOpen ? "filterNavContainer" : "filterNavContainer Active" }>
        <div className="filterCloseIcon" onClick={()=>setIsOpen(false)}><CloseIcon /></div>
        <div className="filterList">
            {/* <label>Department</label>
            <Department selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} /> */}
            <MultiSelectDropDown selectedOption={selectedDepartment} setSelectedOption={setSelectedDepartment} options={options} isShowLabel={true} placeholder=""/>
        </div>
        <div className="filterList">
            { user &&   <User selectedUser={selectedUser} setSelectedUser={setSelectedUser} users={user}/>}
        </div>
        
    </div>
}

export default FilterNav;