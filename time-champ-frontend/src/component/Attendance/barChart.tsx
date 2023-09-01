import React, { useState } from 'react';
import './barchart.scss';
import Avatar from '@mui/material/Avatar/Avatar';
import { deepOrange } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import { formatTime } from '../helper/helper';

type userActivity = {
  activity_status: string;
  end_time: string;
  spent_time: number;
  start_time: string;
  user_AtId: number;
}



function convertNanosecondsToHours(nanoseconds: number): number {
    return Math.ceil(((nanoseconds / 3600000000000)/24)*100); // 1 hour = 3,600,000,000,000 nanoseconds
}

const ChartComponent:React.FC<{data : userActivity[] | undefined}> = ({data}) => {
  const [isShowTooltip,setIsShowTooltip] = useState<boolean>(false);
  console.log(data)
  return <div className='attendanceChartContainer'>
          <div className='timingsColumn'>
            <div><p>6:00</p><p>AM</p></div>
            <div><p>8:00</p><p>AM</p></div>
            <div><p>10:00</p><p>AM</p></div>
            <div><p>12:00</p><p>AM</p></div>
            <div><p>2:00</p><p>PM</p></div>
            <div><p>4:00</p><p>PM</p></div>
            <div><p>6:00</p><p>PM</p></div>
            <div><p>8:00</p><p>PM</p></div>
            <div><p>10:00</p><p>PM</p></div>
            <div><p>12:00</p><p>PM</p></div>
            <div><p>2:00</p><p>AM</p></div>
            <div><p>4:00</p><p>AM</p></div>
            <div><p>6:00</p><p>AM</p></div>
          </div>
          <div className='timingsRow Working'>
              { data &&
                data.map((value,index) => {
                  const style:any = {
                    "--width":convertNanosecondsToHours(value.spent_time)+"%"
                  }
                  return <abbr title={formatTime(value.spent_time)} style={style} className={"chartData "+(value.activity_status==="Idle(Break)" ? "Break" : value.activity_status)}></abbr>
                })
              }
          </div>
          {
            data &&   <div className='legendContainer'>
            <div className='legendData'><p className='legend Offline'></p><span>Offline</span></div>
            <div className='legendData'><p className='legend Break'></p><span>Break</span></div>
            <div className='legendData'><p className='legend Working'></p><span>Working</span></div>
        </div>
          }
        
    
  </div>
}

export default ChartComponent;
