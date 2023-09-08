import moment from "moment";
import { createPortal } from "react-dom";
import {  useState } from "react";
import FullScreen from "../fullScreen/fullScreen";


const ScreenshotImage = (props: any) => {
  
   
    const { screenshotData } = props
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
        <div className='imageContainer' >
            {
                screenshotData?.map((item: ScreenshotDetailsObject, r: number) => {
                    return (
                        <div key={r} className="imageChild">
                            <div>
                                <p className="imageName" >{item.name}</p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div className="screenshotImage" onClick={fullscreenImage}>
                                    <img
                                        src={`data:image/jpeg;base64,${item.screenshot}`}
                                        alt="Screenshot"
                                        className="imageStyle"
                                    ></img>
                                </div>
                                <div>
                                    <p className="imageTime">{moment(new Date(item.startTime)).format("hh:mm A")}</p>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            {createPortal(showImageFullScreen && <FullScreen screenshotData={screenshotData} fullScreenImageDatum={fullScreenImageDatum} fullscreenImage={fullscreenImage} />, document.body)}
        </div>
    )
}

export default ScreenshotImage