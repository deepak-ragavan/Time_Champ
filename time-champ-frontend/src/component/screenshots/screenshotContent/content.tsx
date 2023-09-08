import './content.scss'
import React from "react";
import Loading from '../loading'
import NoDataConatiner from './noDataConatiner';
import ScreenshotImage from './imagedatacontainer'
import { convertTo12HourFormat } from '../../helper/helper';


const ScreenshotContent: React.FC<ScreenshotContentProps> = (props: ScreenshotContentProps) => {
  const { screenshotData,handleBackwardTime,handleForwardTime,isLoading,fromTime,toTime } = props;

  return (
    <div className="screenshotContent">
      <div className="Time">
        <div className="Round"></div>
        <div className="hourTimePeriodContainer">
          <span className="material-icons-outlined" onClick={handleBackwardTime}>
            arrow_back
          </span>
          <p className="hourTimePeriod">{`${convertTo12HourFormat(fromTime)} - ${convertTo12HourFormat(toTime)}`}</p>
          <span
            className="material-icons-outlined"
            onClick={handleForwardTime}
          >
            arrow_forward
          </span>
        </div>
      </div>
      {/* { (screenshotData && screenshotData.length !== 0) ? isLoading ? <Loading/> :
        <ScreenshotImage screenshotData={screenshotData} />
        :
      <NoDataConatiner/>
      } */}
      { isLoading? <Loading/> :(screenshotData && screenshotData.length !== 0) ?
        <ScreenshotImage screenshotData={screenshotData} />
        :
      <NoDataConatiner/>
      }
    </div>
  )
}


export default ScreenshotContent