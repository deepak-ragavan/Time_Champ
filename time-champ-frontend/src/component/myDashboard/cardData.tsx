import React from 'react';
import './cardData.scss'
import moment from 'moment';
import { formatTime } from '../helper/helper';

const CardData:React.FC<{contentHeading:string,startOrEndTime:string,workingHours:number,icon:any}> = ({contentHeading,startOrEndTime,workingHours,icon}) => {
    return <div className='Dashboardcard'>
        <span>
        <h5>{contentHeading}</h5>
        {
            startOrEndTime? <h2>{moment(startOrEndTime).format("HH:MM")}</h2> : workingHours?<h2>{formatTime(workingHours)}</h2>:<h2>No data</h2>
        }
        </span>
          <img src={icon}/>
        
    </div>
}

export default CardData;