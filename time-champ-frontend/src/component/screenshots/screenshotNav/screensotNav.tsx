import React from 'react'
import "./screenshotNav.scss";
import DatePicker from '../../common/datePicker';
import SideBarFilter from '../sideBarFilter';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUserDataReducer } from '../../store/reducer/reducerUserData';


const ScreenshotNav: React.FC<ScreenshotNavProps> = (props: ScreenshotNavProps) => {
    const userDetails = useSelector(selectUserDataReducer).childUsersDetails
    const { presentMoment, setPresentMoment, setUserID,userID, setChartView } = props
    return (
        <div className="ScreenshotDetailsNav">
            <DatePicker  presentMoment={presentMoment} setPresentMoment={setPresentMoment}  />
            <div className="ScreenshotUser">
                <span className="material-icons-outlined iconSize" onClick={() => setChartView({
                    "showChart": true,
                    "chartType": 'area'
                })}>
                    area_chart
                </span>
                <span className="material-icons-outlined iconSize" onClick={() => setChartView({
                    "showChart": true,
                    "chartType": 'bar'
                })}>
                    analytics
                </span>
                <SideBarFilter>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label" >Users</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                onChange={(e)=>setUserID(e.target.value)}
                                value={userID}
                                label="Users"
                            >
                                {
                                    userDetails.length !== 0  && userDetails.map((value) => (
                                        <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                </SideBarFilter>
            </div>
        </div>
    )
}
export default ScreenshotNav