import moment from "moment";
import { createPortal } from "react-dom";
import { useContext, useState } from "react";
import NoDataFound from '../../../2953962.jpg'
import FullScreen from "../fullScreen/fullScreen";


const ScreenshotImage = (props: any) => {
    const { modifiedScreenshotData } = props
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
        <div className={modifiedScreenshotData.length !== 0 ? 'imageContainer' : 'imageContainer noBorder'}>
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
                                <div>
                                    <p className="imageTime">{moment(new Date(item.startTime)).format("hh:mm A")}</p>
                                </div>
                            </div>
                        </div>
                    )
                })
                : <div className="noDataContainer"><img src={NoDataFound} alt='No data Found....' className="Nodata" /></div>}
            {createPortal(showImageFullScreen && <FullScreen modifiedScreenshotData={modifiedScreenshotData} fullScreenImageDatum={fullScreenImageDatum} fullscreenImage={fullscreenImage}/>,document.body)}
        </div>
    )
}

export default ScreenshotImage