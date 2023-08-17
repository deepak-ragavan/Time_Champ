import React from 'react'
import { Calendar } from "react-date-range";
import moment from 'moment';
import "./screenshotNav.scss";

const ScreenshotNav: React.FC<ScreenshotNavProps> = (props: ScreenshotNavProps) => {
    const { handleBackwardDate, verifiedCurrentDate, presentMoment, handleForwardDate, calanderView, calnderShow, calanderToDateChange, setUserID, userDetails, setChartView } = props
    return (
        <div className="ScreenshotDetailsNav">
            <div className="ScreenshotTime">
                <div className="arrowBox">
                    <span
                        className="material-icons-outlined"
                        onClick={handleBackwardDate}
                    >
                        arrow_back
                    </span>
                </div>
                <div className={verifiedCurrentDate ? "arrowBox boxdisable " : "arrowBox"} onClick={handleForwardDate} >
                    <span
                        className="material-icons-outlined"
                    >
                        arrow_forward
                    </span>
                </div>
                <div className="dateConatiner">
                    <div>{presentMoment}</div>
                    <div>
                        <span className="material-icons-outlined" onClick={calanderView}>
                            calendar_month
                        </span>
                        {calnderShow && (
                            <Calendar
                                date={moment(new Date(presentMoment)).toDate()}
                                onChange={calanderToDateChange}
                                className="calenderContainer"
                            />
                        )}
                    </div>
                </div>
                <div className="timeContainer">
                    <select className="timeSelect">
                        <option value="Asia/Kolkata">IST</option>
                    </select>
                </div>
            </div>
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