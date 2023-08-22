import React from 'react';
import './cardData.scss'
import moment from 'moment';
import { formatTime } from '../helper/helper';

const CardData:React.FC<{contentHeading:string,startOrEndTime:string,workingHours:number}> = ({contentHeading,startOrEndTime,workingHours}) => {
    return <div className='cardContainer'>
        <h6>{contentHeading}</h6>
        {
            startOrEndTime!=='' ? <h2>{moment(startOrEndTime).format("HH:MM")}</h2> : <h2>{formatTime(workingHours)}</h2>
        }
        
    </div>
}

export default CardData;