import CardData from "./cardData";
import './todayDataContainer.scss'

const TodayDataContainer = () => {
    return <div className="todayDataContainer">
        <CardData contentHeading="Start Time" startOrEndTime="08-08-2023 11:10" workingHours={0}/>
        <CardData contentHeading="End Time" startOrEndTime="08-08-2023 21:20" workingHours={0}/>
        <CardData contentHeading="Working Hours" startOrEndTime="" workingHours={6000000} />
        <CardData contentHeading="Productive" startOrEndTime="" workingHours={5000000}/>
        <CardData contentHeading="Idle" startOrEndTime="" workingHours={1000000}/>  
    </div>
}

export default TodayDataContainer;