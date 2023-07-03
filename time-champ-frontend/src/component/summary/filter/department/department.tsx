import './department.scss'
import React, { useState,useRef,useEffect } from "react";
import { MultiSelect } from 'react-multi-select-component';
import { useDispatch } from 'react-redux';
import { saveDepartment } from '../../../store/reducer/reducerFilter';

const Department: React.FC = () => {
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false);
  const refOne = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState([]);

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

  useEffect(() => {
    // Hide on outside click
    const hideOnClickOutside = (e:any) => {
      if( refOne.current && !refOne.current.contains(e.target) ) {
        setOpen(false)
      }
      const values = selected.map((val:departmentOptions) => val.value)
      dispatch(saveDepartment(values))
    }

    document.addEventListener('click', hideOnClickOutside);

    return () => {
        document.removeEventListener('click', hideOnClickOutside);
    };
  },[dispatch,selected])     

  return (
    <div className="departmentWrap" ref={refOne}>
       <div onClick={() => setOpen(!open)} className='downarrow'>
            <span className="material-icons-round dropdown">arrow_drop_down</span>
            <span className="navtext">Department</span>  
        </div>

      <div className='departmentDropDown'>
        {open && (
            <MultiSelect
              options={options}
              value={selected}
              onChange={setSelected}
              labelledBy={"Select"}
            />       
        )}
      </div>
    </div>
  );
};

export default Department;