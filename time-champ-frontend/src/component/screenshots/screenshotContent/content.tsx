import moment from "moment";
import './content.scss'
import { useState } from "react";

const ScreenshotContent: React.FC<ScreenshotContentProps> = (props: ScreenshotContentProps) => {
  const { handleBackwardTime, hourIntervel, handleForwardTime, modifiedScreenshotData, } = props;
  const [showImageFullScreen, setShowImageFullScreen] = useState<Boolean>(false);
  const [fullScreenImageDatum, setFullScreenImageDatum] = useState('');


  const fullscreenImage = (e: any) => {
    if (e.target.className === "closeFullScreenButton") {
      return setShowImageFullScreen(false);
    }
    setFullScreenImageDatum(e.target.src)
    setShowImageFullScreen(true);
  }

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
      <div className="imageContainer">
        {modifiedScreenshotData.length !== 0 ?
          modifiedScreenshotData.map((item: Imagedata, r: number) => {
            return (
              <div key={r} className="imageChild">
                <div>
                  <p className="imageName" >{item.name}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="screenshotImage" onClick={fullscreenImage}>
                    <img
                      src={`data:image/jpeg;base64,${item.screenshot}`}
                      alt=""
                      className="imageStyle"
                    ></img>
                  </div>
                  {showImageFullScreen && <div className="fullScreenImageOverlay">
                    <p className="closeFullScreenButton" onClick={fullscreenImage}>X</p>
                    <div className="fullScreenImage">
                      <img
                        src={fullScreenImageDatum}
                        alt=""
                        className="imageStyle"
                      ></img>
                    </div>
                    <div className="bottomImageList">
                      {modifiedScreenshotData.map((item: Imagedata, r: number) => {
                        return (
                          <div key={r} onClick={fullscreenImage}>
                            <img
                              src={`data:image/jpeg;base64,${item.screenshot}`}
                              alt=""
                              className="bottomImageStyle"
                            ></img>
                          </div>
                        )
                      })}
                    </div>

                  </div>}
                  <div>
                    <p className="imageTime">{moment(new Date(item.startTime)).format("hh:mm A")}</p>
                  </div>
                </div>
              </div>
            )
          })
          : <>No data Found....</>}



      </div>
    </div>
  )
}
export default ScreenshotContent