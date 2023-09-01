import './datePicker.scss'
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar } from "react-date-range";
import { verifyCurrentDate } from "../helper/helper";

const DatePicker:React.FC<DatePickerProps> = (props) => {
    const { presentMoment, setPresentMoment } = props
    const [calnderShow, setCalanderShow] = useState(false);
    const [verifiedCurrentDate, setVerifiedCurrentDate] = useState(false);

    const handleBackwardDate = () => {
        const date = moment(new Date(presentMoment)).subtract(1, "days").format("ddd, MMM DD, YYYY");
        setPresentMoment(date);
    };

    const calanderToDateChange = (selectedDate: Date) => {
        const date = moment(selectedDate).format("ddd, MMM DD, YYYY");
        setPresentMoment(date);
      };

    const calanderView = () => {
        setCalanderShow(!calnderShow);
    };

    const handleForwardDate = () => {
        if (!verifiedCurrentDate) {
          const date = moment(new Date(presentMoment)).add(1, "days").format("ddd, MMM DD, YYYY");
          setPresentMoment(date);
        }
    };

    useEffect(()=> {
        verifyCurrentDate(presentMoment,setVerifiedCurrentDate);
    },[presentMoment])

    return   <div className="ScreenshotTime">
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
                    maxDate={new Date()}
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
}

export default DatePicker;