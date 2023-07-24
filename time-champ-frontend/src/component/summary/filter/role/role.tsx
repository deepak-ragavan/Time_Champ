import './role.scss'
import React, { useState,useRef, useEffect } from "react";
import { MultiSelect } from 'react-multi-select-component';
import { useDispatch, useSelector } from 'react-redux';
import { saveRole, selectFilterData } from '../../../store/reducer/reducerFilter';

type roleOptions = {
  label:string,
  value:string
}


const Role: React.FC<{selectedRole:roleOptions[],setSelectedRole:(val:roleOptions[])=>void}> = ({selectedRole,setSelectedRole}) => {
  const refOne = useRef<HTMLDivElement | null>(null);

  const options = [
    { label: "Mac/Linux User", value: "Mac/Linux User" },
    { label: "Manager", value: "Manager" },
    { label: "Silent Linux", value: "Silent Linux" },
    { label: "Super Admin", value: "Super Admin" },
    { label: "User", value: "User" },
  ];

  return (
    <div className="roleWrap" ref={refOne}>
      <div className='roleDropDown' >
            <MultiSelect
              options={options}
              value={selectedRole}
              onChange={(values:roleOptions[]) => setSelectedRole(values)}
              labelledBy={"Select"}
            />       
      </div>
    </div>
  );
};

export default Role;