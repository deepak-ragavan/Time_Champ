import './branch.scss'
import React, { useState,useRef, useEffect } from "react";
import { MultiSelect } from 'react-multi-select-component';
import { useDispatch, useSelector } from 'react-redux';
import { saveBranch, selectFilterData } from '../../../store/reducer/reducerFilter';

type branchOptions = {
  label:string,
  value:string
} 

const Branch: React.FC = () => {
  const dispatch = useDispatch()
  const refOne = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<branchOptions[]>([]);
  const filterData = useSelector(selectFilterData)

  const options = [
    { label: "Porur", value: "Porur" },
    { label: "Navalur", value: "Navalur" },
    { label: "Bangalore", value: "Bangalore" },
  ];

  const handleOnChangeMultiSelect = (items:branchOptions[]) => {
    const values = items.map((val: branchOptions) => val.value);
    dispatch(saveBranch(values));
  };

useEffect(()=>{
  if(filterData.branch){
    const selectedValue = filterData.branch.map((stringValue) =>
    options.find((option) => option.value === stringValue));
    setSelected(selectedValue as branchOptions[]);
  }

},[filterData])

  return (
    <div className="branchWrap" ref={refOne}>
      <div className='branchDropDown' >
            <MultiSelect
              options={options}
              value={selected}
              onChange={(values:branchOptions[]) => handleOnChangeMultiSelect(values)}
              labelledBy={"Select"}
            />       
      </div>
    </div>
  );
};

export default Branch;