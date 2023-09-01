import React from 'react'
import "./screenshotNav.scss";
import DatePicker from '../../common/datePicker';

const ScreenshotNav: React.FC<ScreenshotNavProps> = (props: ScreenshotNavProps) => {
    const { presentMoment, setPresentMoment, setUserID, userDetails, setChartView } = props
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
                <div className="userDetails">
                    <span className="material-icons-round">account_circle</span>
                    <select className="timeSelect" onChange={setUserID}>
                        {userDetails.length !== 0 &&
                            userDetails.map((user: userList) => {
                                return (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="screenshotFilter">Filters</div>
            </div>
        </div>
    )
}
export default ScreenshotNav