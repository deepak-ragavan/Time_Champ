import React from 'react'
import './cardview.scss'
import { formatTime } from '../../helper/helper'

type summaryData = {
    appName:string,
    spentTime:number,
    appIconUrl:string,
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
                            <p className='defaultApplogo'>{values.appName.charAt(0)}</p>
                            <p>{values.appName}</p>
                        </div>
                        <div className="cl-2">
                            <p>{formatTime(values.spentTime)}</p>
                        </div>
                    </div>
                    ))
                    ) : (<p className='NoContent'>No data to display</p>)
                }
            </div>
        </div>
    )
}

export default CardView;