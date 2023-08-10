import { MicOutlined } from '@mui/icons-material'
import './multiSelectDropDown.scss' 
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';

type filterOptions = {
    label:string,
    value:string
 } 
const MultiSelectDropDown: React.FC<{selectedOption:string,setSelectedOption:(value:string)=>void,options:filterOptions[], isShowLabel:boolean, placeholder:string}> = ({selectedOption, setSelectedOption, options, isShowLabel, placeholder}) => {
    // const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    //     const {
    //       target: { value },
    //     } = event;
    //     console.log(event.target.value.toString())
    //     setSelectedValues(
    //       // On autofill we get a stringified value.
    //       typeof value === 'string' ? value.split(',') : value,
    //     );
    //     setSelectedOption(selectedValues.toString())
    //     console.log(selectedOption)
    //   };
    
    return <div className='multiselectDropDown'>
        {isShowLabel ? 
          <FormControl sx={{ m: 1, width: 250 }}>
            <InputLabel id="demo-multiple-checkbox-label">Department</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={selectedOption===""?[]:selectedOption.split(',')}
              onChange={(e)=>setSelectedOption(e.target.value.toString())}
              input={<OutlinedInput label="Department" />}
              renderValue={(selected) => selected.join(', ')}
              >
              {options.map((name) => (
                  <MenuItem key={name.label} value={name.value}>
                  <Checkbox checked={selectedOption.split(',').indexOf(name.value) > -1} />
                  <ListItemText primary={name.value} />
                  </MenuItem>
              ))}
            </Select>
        </FormControl>
        : <FormControl sx={{ m: 1, width: 250 }}>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              displayEmpty
              value={selectedOption===""?[]:selectedOption.split(',')}
              onChange={(e)=>setSelectedOption(e.target.value.toString())}
              renderValue={(selected) => {
                console.log(selected.length)
                if (selected.length === 0) {
                  return <em>{placeholder}</em>;
                } 
                return selected.join(', '); }}
              >
              {options.map((name) => (
                  <MenuItem key={name.label} value={name.value}>
                  <Checkbox checked={selectedOption.split(',').indexOf(name.value) > -1} />
                  <ListItemText primary={name.value} />
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
        
    </div>
}

export default MultiSelectDropDown;