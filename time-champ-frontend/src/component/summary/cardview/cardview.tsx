import React from 'react'
import './cardview.scss'
import { formatTime } from '../../helper/helper'
import NoDataFound from '../../../2953962.jpg'

type summaryData = {
    appName:string,
    spentTime:number,
    appIcon:string,
}

type Cardprops = {
    heading : string,
    headingClassName:string
    data : summaryData[]
}


const CardView: React.FC<Cardprops> = ({ heading,headingClassName,data }) => {

    return (
        <div className="cardview">
            <div className={headingClassName}>
                <h4>{heading}</h4>
            </div>
            <div className="cardcontent">
                { data.length>0 ?
                    (data.map((values) => (
                        <div className="row">
                        <div className="cl-1">
                            {
                                values.appIcon === null ?
                                <p className='defaultApplogo'>{values.appName.charAt(0)}</p> :
                                <img
                                    src={`data:image/jpeg;base64,${values.appIcon}`}
                                    alt=""
                                    className="defaultApplogo"
                                ></img>
                            }
                           
                            <p>{values.appName}</p>
                        </div>
                        <div className="cl-2">
                            <p>{formatTime(values.spentTime)}</p>
                        </div>
                    </div>
                    ))
                    ) : (<div className='NoDataFoundImageContainer'><img className='NoDataFound' src={NoDataFound}></img></div>)
                }
            </div>
        </div>
    )
}

export default CardView;