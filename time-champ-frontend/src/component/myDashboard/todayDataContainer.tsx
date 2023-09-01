import CardData from "./cardData";
import './todayDataContainer.scss'
import { useSelector } from "react-redux";
import { selectUserDataReducer } from "../store/reducer/reducerUserData";

type dashData ={
        id: number,
        startTime: string,
        endTime: string,
        idle: number,
        working: number,
        breakTime: number,
        totalTime: number,
        productive: number,
        unproductive: number,
        neutral: number,
        deskTime: number
}

function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  const checkinTimeFormater =(inputDateString:string) =>{
    const date = new Date(inputDateString);
    const outputDateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
 
    return outputDateString 
     
 }
  
const TodayDataContainer: React.FC<{todayData:dashData | null}> = ({todayData}) => {
    
    const userId = useSelector(selectUserDataReducer).id;
    const today =getFormattedDate();

    // /user-attendance/getUserAttendanceDetails?userId=1&date=2023-08-10

    return <div className="DashboardDataContainer">
        <CardData contentHeading="Start Time" startOrEndTime={todayData?checkinTimeFormater(todayData.startTime):''} workingHours={0} icon='icons/start.svg'/>
        <CardData contentHeading="End Time" startOrEndTime={todayData?checkinTimeFormater(todayData.endTime):""} workingHours={0} icon='icons/last.svg'/>
        <CardData contentHeading="Idle" startOrEndTime="" workingHours={todayData?todayData.idle:0} icon='icons/idle.svg'/>
        <CardData contentHeading="Working Hours" startOrEndTime="" workingHours={todayData?todayData.working:0} icon='icons/laptop.svg'/>
        <CardData contentHeading="Break Time" startOrEndTime="" workingHours={todayData?todayData.breakTime:0} icon='icons/pause.svg'/>  
        <CardData contentHeading="Total Time" startOrEndTime="" workingHours={todayData?todayData.totalTime:0} icon='icons/clock.svg'/>
        <CardData contentHeading="Productive" startOrEndTime="" workingHours={todayData?todayData.productive:0} icon='icons/productive.svg'/>
        <CardData contentHeading="Unproductive" startOrEndTime="" workingHours={todayData?todayData.unproductive:0} icon='icons/unproductive.svg'/>
        <CardData contentHeading="Neutral" startOrEndTime="" workingHours={todayData?todayData.neutral:0} icon='icons/neutral.svg'/>
        <CardData contentHeading="DeskTime" startOrEndTime="" workingHours={todayData?todayData.deskTime:0} icon='icons/deskTime.svg'/>  
    </div>
}

export default TodayDataContainer;