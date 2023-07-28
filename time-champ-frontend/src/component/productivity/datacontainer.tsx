import "./datacontainer.scss"
import moment from "moment";
import React from "react"
import StackedBar from "./chart/stackedBars";
import { milliSecTOSeconds } from "../helper/helper";

type productivityDataProps = {
    Productive:number,
    Unproductive:number,
    Neutral:number,
    Idle:number,
    Working: number,
    StartTime:string,
    EndTime: string,
  }
const DataContainer: React.FC<{datas:productivityDataProps[],showIdleTimeData:boolean}> = ({datas,showIdleTimeData}) => {
    console.log("datas inside", datas)
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
                            <div className="dateFieldDesign">
                                <div className="col-1">
                                    <div className="dayField">
                                        <p>{moment(value.StartTime).format("dddd")}</p>
                                    </div>
                                    <div className="dateField">
                                        <p>{moment(value.StartTime).format("D-MMM")}</p>
                                    </div>
                                </div>
                            </div>
                            {
                                value.Working>0 && 
                                <>
                                    <div className="productivityChart">
                                        <StackedBar Productive={milliSecTOSeconds(value.Productive)} Unproductive={milliSecTOSeconds(value.Unproductive)} 
                                        Neutral={milliSecTOSeconds(value.Neutral)} Idle={milliSecTOSeconds(value.Idle)} showIdleTimeData={showIdleTimeData}/>
                                    </div>
                                    <div className="StartEndTime">
                                        <p>{moment(value.StartTime).format('LT')+"-"+moment(value.EndTime).format('LT')}</p>
                                    </div>
                                    <div className="TotalWorkingHours">
                                            <p>{moment.utc(value.Working).format('H[h] m[m] s[s]')}</p>
                                    </div>
                                </> 
                            }
                    </div>
                    )) : (<p className='NoContent'>No data to display</p>)
                }
            </div>
        </>
     
       
    )
}

export default DataContainer;