import './department.scss'
import React, { useState,useRef, useEffect } from "react";
import { MultiSelect } from 'react-multi-select-component';
import { useDispatch, useSelector } from 'react-redux';
import { saveDepartment, selectFilterData } from '../../../store/reducer/reducerFilter';

const Department: React.FC = () => {
  const dispatch = useDispatch()

  const filterData = useSelector(selectFilterData)
  const refOne = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<departmentOptions[]>([]);

  type departmentOptions = {
    label:string,
    value:string
  }

  const options = [
    { label: "Administration ", value: "Administration" },
    { label: "Finance", value: "Finance" },
    { label: "IT", value: "IT" },
    { label: "Sales", value: "Sales" },
  ];

  const handleOnChangeMultiSelect = (items:departmentOptions[]) => {
      const values = items.map((val: departmentOptions) => val.value);
      dispatch(saveDepartment(values));
  };

  useEffect(()=>{
    if(filterData.department){
      const selectedValue = filterData.department.map((stringValue) =>
      options.find((option) => option.value === stringValue));
      setSelected(selectedValue as departmentOptions[]);
    }

  },[filterData])

  return (
    <div className="departmentWrap" ref={refOne}>
      <div className='departmentDropDown'>
            <MultiSelect
              options={options}
              value={selected}
              onChange={(values:departmentOptions[]) => handleOnChangeMultiSelect(values)}
              labelledBy={"Select"}
            />       
      </div>
    </div>
  );
};

export default Department;