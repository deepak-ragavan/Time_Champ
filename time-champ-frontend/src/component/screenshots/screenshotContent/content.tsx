import './content.scss'
import React, { Suspense, useMemo } from "react";
import Loading from '../loading'


const ScreenshotContent: React.FC<ScreenshotContentProps> = (props: ScreenshotContentProps) => {
  const { handleBackwardTime, hourIntervel, handleForwardTime, modifiedScreenshotData } = props;
  const ScreenshotImage = useMemo(() => React.lazy(()=>import("./imagedatacontainer")), [modifiedScreenshotData]) 
  return (
    <div className="screenshotContent">
      <div className="Time">
        <div className="Round"></div>
        <div className="hourTimePeriodContainer">
          <span className="material-icons-outlined" onClick={handleBackwardTime}>
            arrow_back
          </span>
          <p className="hourTimePeriod">{hourIntervel}</p>
          <span
            className="material-icons-outlined"
            onClick={handleForwardTime}
          >
            arrow_forward
          </span>
          <p className="totalTimeWorked">total time worked:</p>
        </div>
      </div>
      <Suspense fallback={<Loading/>}>
      <ScreenshotImage  modifiedScreenshotData={modifiedScreenshotData} />
      </Suspense>
    </div>
  )
}


export default ScreenshotContent