import './fullScreen.scss'
interface FullScreenProps {
    fullscreenImage:any;
    fullScreenImageDatum:any;
    modifiedScreenshotData:any;
}

const FullScreen = (props:FullScreenProps) => {
    const{fullscreenImage,fullScreenImageDatum,modifiedScreenshotData}=props;
   
  return (
    <div className="fullScreenImageOverlay">
    <div className="closeFullScreen"><div className="closeFullScreenButton" onClick={fullscreenImage}>X</div></div>
    <div className="fullScreenImage">
        <img
            src={fullScreenImageDatum}
            alt=""
            className="imageStyle"
        ></img>
    </div>
    <div className="bottomImageContainer">
        {modifiedScreenshotData.length !==0 && modifiedScreenshotData.map((item: Imagedata, r: number) => {
            return (
                <div key={r} onClick={fullscreenImage} className="bottomImageList" >
                    <img
                        src={`data:image/jpeg;base64,${item.screenshot}`}
                        alt=""
                        className="bottomImageStyle"
                    ></img>
                </div>
            )
        })}
    </div>
</div>
  )
}

export default FullScreen