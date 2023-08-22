import moment from "moment";
import React, { useState } from "react";
import { Range } from "react-date-range";
import DateRangeComp from "../summary/filter/datepicker/dateRangePicker";
import TextField from "@mui/material/TextField";


const DateRangePickerComponent: React.FC<{range:Range[],setRange:(value:Range[])=>void}> = ({range,setRange}) => {
    const [open,setOpen] = useState(false)
    return <div>
        <TextField  id="outlined-basic" size="small" margin="dense" label="Start-End" variant="outlined" value={moment(range[0].startDate).format('YYYY-MM-DD')+" - "+moment(range[0].endDate).format('YYYY-MM-DD')} onClick={() => setOpen(!open)} />
        { open && <DateRangeComp range={range} setRange={setRange}/>}
    </div>
}

export default DateRangePickerComponent;