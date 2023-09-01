import CardData from '../myDashboard/cardData'
import './todayDataContainer.scss'

type attendaceData = {
    id: number,
    name:string,
    employeeId:string,
    startTime: string,
    endTime: string,
    idle: number,
    working: number,
    nonWorking: number,
    productive: number,
    unproductive: number,
    neutral: number,
    userActivity: userActivity[]
}

type userActivity = {
    activity_status: string;
    end_time: string;
    spent_time: number;
    start_time: string;
    user_AtId: number;
}

const checkinTimeFormater =(inputDateString:string) =>{
    const date = new Date(inputDateString);
    const outputDateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
 
    return outputDateString 
     
 }

const TodayDataContainer:React.FC<{todayData:attendaceData | undefined}> = ({todayData}) => {
    return <div className="todayDataContainer">
        <CardData contentHeading="Start Time" startOrEndTime={todayData?checkinTimeFormater(todayData.startTime):''} workingHours={0} icon='icons/start.svg'/>
        <CardData contentHeading="End Time" startOrEndTime={todayData?checkinTimeFormater(todayData.endTime):""} workingHours={0} icon='icons/last.svg'/>
        <CardData contentHeading="Working Hours" startOrEndTime="" workingHours={todayData?todayData.working:0} icon='icons/laptop.svg'/>
        <CardData contentHeading="Idle" startOrEndTime="" workingHours={todayData?todayData.idle:0} icon='icons/idle.svg'/>
        <CardData contentHeading="Productive" startOrEndTime="" workingHours={todayData?todayData.productive:0} icon='icons/productive.svg'/>
    </div>
}

export default TodayDataContainer;