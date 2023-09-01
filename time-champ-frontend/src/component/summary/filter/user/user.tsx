import './user.scss'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';
type userProps = {
    id: number,
    name: string,
    role: string
}
const User: React.FC<{selectedUser:userProps | null,setSelectedUser:(val:userProps)=>void,users:userProps[]}> = ({selectedUser,setSelectedUser,users}) => {
    
    const handleSelected = (e: SelectChangeEvent<number>): void => {
        const selected = users.find((user)=>user.id===e.target.value);
        if(selected) {
            setSelectedUser(selected)
        }
    }

    return (
        <div className="userContainer">
            <div className="userDropdown">
                <FormControl fullWidth>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedUser===null ? "" : selectedUser?.id}
                    onChange={(e) => handleSelected(e)}
                    displayEmpty
                    >
                    <MenuItem value="">
                        <em className='placeholder'>Users</em>
                    </MenuItem>
                    {
                        users && users.map((value)=> (
                            <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>
                        ))
                    }
                    </Select>
                </FormControl>

            </div>
        </div>
    )
}

export default User;