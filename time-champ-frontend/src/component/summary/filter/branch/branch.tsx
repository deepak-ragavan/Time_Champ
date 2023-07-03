import './branch.scss'
import React, { useState,useRef,useEffect } from "react";
import { MultiSelect } from 'react-multi-select-component';
import { useDispatch } from 'react-redux';
import { saveBranch } from '../../../store/reducer/reducerFilter';

const Branch: React.FC = () => {
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false);
  const refOne = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState([]);

  type branchOptions = {
    label:string,
    value:string
  }

  const options = [
    { label: "Porur", value: "Porur" },
    { label: "Navalur", value: "Navalur" },
    { label: "Bangalore", value: "Bangalore" },
  ];

  useEffect(() => {
    // Hide on outside click
    const hideOnClickOutside = (e:any) => {
      if( refOne.current && !refOne.current.contains(e.target) ) {
        setOpen(false)
      }
      const values = selected.map((val:branchOptions) => val.value)
      dispatch(saveBranch(values))
    }

    document.addEventListener('click', hideOnClickOutside);

    return () => {
        document.removeEventListener('click', hideOnClickOutside);
    };
  },[dispatch,selected])     

  return (
    <div className="branchWrap" ref={refOne}>
       <div onClick={() => setOpen(!open)} className='downarrow'>
            <span className="material-icons-round dropdown">arrow_drop_down</span>
            <span className="navtext">Branch</span>  
        </div>

      <div className='branchDropDown' >
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

export default Branch;