import './department.scss'
import React, { useState,useRef, useEffect } from "react";
import { MultiSelect } from 'react-multi-select-component';
import { useDispatch, useSelector } from 'react-redux';
import { saveDepartment, selectFilterData } from '../../../store/reducer/reducerFilter';

type departmentOptions = {
  label:string,
  value:string
}

const Department: React.FC<{selectedDepartment:departmentOptions[],setSelectedDepartment:(val:departmentOptions[])=>void}> = ({selectedDepartment,setSelectedDepartment}) => {
  const refOne = useRef<HTMLDivElement | null>(null);

  const options = [
    { label: "Administration ", value: "Administration" },
    { label: "Finance", value: "Finance" },
    { label: "IT", value: "IT" },
    { label: "Sales", value: "Sales" },
  ];

  return (
    <div className="departmentWrap" ref={refOne}>
      <div className='departmentDropDown'>
            <MultiSelect
              options={options}
              value={selectedDepartment}
              onChange={(values:departmentOptions[]) => setSelectedDepartment(values)}
              labelledBy={"Select"}
            />       
      </div>
    </div>
  );
};

export default Department;