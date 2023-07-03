import './role.scss'
import React, { useState,useRef,useEffect } from "react";
import { MultiSelect } from 'react-multi-select-component';
import { useDispatch } from 'react-redux';
import { saveRole } from '../../../store/reducer/reducerFilter';

const Role: React.FC = () => {
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false);
  const refOne = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState([]);

  type roleOptions = {
    label:string,
    value:string
  }

  const options = [
    { label: "Mac/Linux User", value: "Mac/Linux User" },
    { label: "Manager", value: "Manager" },
    { label: "Silent Linux", value: "Silent Linux" },
    { label: "Super Admin", value: "Super Admin" },
    { label: "User", value: "User" },
  ];

  useEffect(() => {
    // Hide on outside click
    const hideOnClickOutside = (e:any) => {
      if( refOne.current && !refOne.current.contains(e.target)) {
        setOpen(false)
        const values = selected.map((val:roleOptions) => val.value)
        dispatch(saveRole(values))
      }
    }

    document.addEventListener('click', hideOnClickOutside);

    return () => {
        document.removeEventListener('click', hideOnClickOutside);
    };
  },[dispatch,selected])     

  return (
    <div className="roleWrap" ref={refOne}>
       <div onClick={() => setOpen(!open)} className='downarrow'>
            <span className="material-icons-round dropdown">arrow_drop_down</span>
            <span className="navtext">Role</span>  
        </div>

      <div className='roleDropDown' >
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

export default Role;