import "./datacontainer.scss"
import moment from "moment";
import React, { useMemo } from "react"
import StackedBar from "./chart/stackedBars";
import { nanoSecTOSeconds } from "../helper/helper";

type productivityDataProps = {
    productive:number,
    unproductive:number,
    neutral:number,
    idle:number,
    working: number,
    date:string,
    startTime:string,
    endTime: string,
  }
const DataContainer: React.FC<{datas:productivityDataProps[],showIdleTimeData:boolean}> = ({datas,showIdleTimeData}) => {
    
    const TotalWorkingTime = (productivityData:productivityDataProps) => {
        let totalWorkingTime = 0;
        if(showIdleTimeData) {
            totalWorkingTime = productivityData.productive+productivityData.unproductive+productivityData.neutral+productivityData.idle;
        } else {
            totalWorkingTime = productivityData.productive+productivityData.unproductive+productivityData.neutral
        }
        const totalWorkingTimeInMilliSeconds = totalWorkingTime / 1e6;
        return totalWorkingTimeInMilliSeconds;
    }

    return (
        <>
            {/* <div className="ProductivityDataContainer">
                {
                    weekDatesArray.map((date) => (
                        <div className="dateFieldDesign">
                            <div className="col-1">
                                <div className="dayField">
                                    <p>{moment(date).format("dddd")}</p>
                                </div>
                                <div className="dateField">
                                    <p>{moment(date).format("D-MMM")}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div> */}
            <div className="ProductivityDataContainer">
                {
                    datas!==null ? datas.map((value) => (
                        <div className="col-2">
                            <div className={value.working>0 ? "dateFieldDesign" : "dateFieldDesign noData"}>
                                <div className="col-1">
                                    <div className="dayField">
                                        <p>{moment(value.date).format("dddd")}</p>
                                    </div>
                                    <div className="dateField">
                                        <p>{moment(value.date).format("D-MMM")}</p>
                                    </div>
                                </div>
                            </div>
                            {
                                value.working>0 ? 
                                <>
                                    <div className="productivityChart">
                                        <StackedBar Productive={nanoSecTOSeconds(value.productive)} Unproductive={nanoSecTOSeconds(value.unproductive)} 
                                        Neutral={nanoSecTOSeconds(value.neutral)} Idle={nanoSecTOSeconds(value.idle)} showIdleTimeData={showIdleTimeData}/>
                                    </div>
                                    <div className="StartEndTime">
                                        <p>{moment(value.startTime).format('LT')+"-"+moment(value.endTime).format('LT')}</p>
                                    </div>
                                    <div className="TotalWorkingHours">
                                            <p>{moment.utc(TotalWorkingTime(value)).format('H[h] m[m] s[s]')}</p>
                                    </div>
                                </> : <p className='NoContent'>No data to display</p>
                            }
                    </div>
                    )) : (<p className='NoContent'>No data to display</p>)
                }
            </div>
        </>
     
       
    )
}

export default DataContainer;