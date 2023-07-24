import './branch.scss'
import React, { useState,useRef, useEffect } from "react";
import { MultiSelect } from 'react-multi-select-component';
import { useDispatch, useSelector } from 'react-redux';
import { saveBranch, selectFilterData } from '../../../store/reducer/reducerFilter';

type branchOptions = {
  label:string,
  value:string
} 

const Branch: React.FC<{selectedBranch:branchOptions[],setSelectedBranch:(val:branchOptions[])=>void}> = ({selectedBranch,setSelectedBranch}) => {
  const refOne = useRef<HTMLDivElement | null>(null);

  const options = [
    { label: "Porur", value: "Porur" },
    { label: "Navalur", value: "Navalur" },
    { label: "Bangalore", value: "Bangalore" },
  ];

  return (
    <div className="branchWrap" ref={refOne}>
      <div className='branchDropDown' >
            <MultiSelect
              options={options}
              value={selectedBranch}
              onChange={(values:branchOptions[]) => setSelectedBranch(values)}
              labelledBy={"Select"}
            />       
      </div>
    </div>
  );
};

export default Branch;