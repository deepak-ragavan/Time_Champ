import { useEffect, useState } from "react"
import React from "react"
import MainDataContainer from "../../mainDataContainer/mainDataContainer"
import { GetTimeClaimDetails } from "../../service/timeClaimApi"
import { useSelector } from "react-redux"
import { selectUserDataReducer } from "../../store/reducer/reducerUserData"
import './timeClaimContent.scss'
import moment from 'moment'
import { formatTime } from "../../helper/helper"


const TimeClaimContent = ({ currentWeek }: any) => {
  const userIds = useSelector(selectUserDataReducer)?.childUsers.join(',')
  const weekStartDate = currentWeek.clone().startOf('week').format('YYYY-MM-DD')
  const weekEndDate = currentWeek.clone().endOf('week').format('YYYY-MM-DD')
  const [timeClaimDetails, setTimeClaimDetails] = useState<{date:string,data:object[],isExpanded:boolean}[]>([])


  const handleCollabsableRow = (e:any,index:number)=>{
    e.preventDefault();
    e.target.classList.toggle("rotateUpsightDown")
    const updatedTimeClaimDetails = [...timeClaimDetails];
    updatedTimeClaimDetails[index].isExpanded = !updatedTimeClaimDetails[index].isExpanded;
    setTimeClaimDetails(updatedTimeClaimDetails);
  }


  useEffect(() => {
    const setTimeCliamDetails = async () => {
      try {
        const timeClaimDetails = await GetTimeClaimDetails(userIds, weekStartDate, weekEndDate);
        timeClaimDetails.forEach((item:any)=>{
          item.isExpanded = false
        })
        setTimeClaimDetails(timeClaimDetails);
      }
      catch (err) {
        console.log(err);
        setTimeClaimDetails([])
      }
    }
    setTimeCliamDetails();
  }, [currentWeek])


  return (
    <MainDataContainer>
      <table className="timeCliamTable">
        <thead >
          <tr>
            <th>Name</th>
            <th>Start Time</th>
            <th>Duration</th>
            <th>Reports To</th>
            <th>Comments</th>
            <th>Approver Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {timeClaimDetails.map((row: any,index:number) => {
            return (
              <React.Fragment key={index}>
                <tr>
                  <td colSpan={7}>
                    <div className="dateRow">
                      <p><span className="material-icons-outlined"  onClick={(e)=>handleCollabsableRow(e,index)} >
                        chevron_right
                      </span></p>
                      <p>{row.date.split(' ')[0]}</p>
                    </div>
                  </td>
                </tr>
                {row.isExpanded && row.data.map((item:any,index:number)=>{
                    return(
                      <tr key={index} className="expandableRows">
                        <td>{item.userName}</td>
                        <td>{moment(new Date(item.startTime)).format('hh:mm:ss A')}</td>
                        <td>{formatTime(item.spentTime)}</td>
                        <td>{item.reportToEmployeeName}</td>
                        <td>{item.reason}</td>
                        <td>{item.approverName}</td>
                        <td>{item.status}</td>
                      </tr>
                    )
                })
                }
              </React.Fragment >
            )
          })}
        </tbody>
        <tfoot>

        </tfoot>
      </table>
    </MainDataContainer>
  )
}

export default TimeClaimContent