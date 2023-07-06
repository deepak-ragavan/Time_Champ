import './role.scss'
import React, { useState,useRef, useEffect } from "react";
import { MultiSelect } from 'react-multi-select-component';
import { useDispatch, useSelector } from 'react-redux';
import { saveRole, selectFilterData } from '../../../store/reducer/reducerFilter';

type roleOptions = {
  label:string,
  value:string
}


const Role: React.FC = () => {
  const dispatch = useDispatch()
  const refOne = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<roleOptions[]>([]);
  const filterData = useSelector(selectFilterData)

  const options = [
    { label: "Mac/Linux User", value: "Mac/Linux User" },
    { label: "Manager", value: "Manager" },
    { label: "Silent Linux", value: "Silent Linux" },
    { label: "Super Admin", value: "Super Admin" },
    { label: "User", value: "User" },
  ];
  
  const handleOnChangeMultiSelect = (items:roleOptions[]) => {
    const values = items.map((val: roleOptions) => val.value);
    dispatch(saveRole(values));
  };

useEffect(()=>{
  if(filterData.role){
    const selectedValue = filterData.role.map((stringValue) =>
    options.find((option) => option.value === stringValue));
    setSelected(selectedValue as roleOptions[]);
  }

},[filterData])

  return (
    <div className="roleWrap" ref={refOne}>
      <div className='roleDropDown' >
            <MultiSelect
              options={options}
              value={selected}
              onChange={(values:roleOptions[]) => handleOnChangeMultiSelect(values)}
              labelledBy={"Select"}
            />       
      </div>
    </div>
  );
};

export default Role;