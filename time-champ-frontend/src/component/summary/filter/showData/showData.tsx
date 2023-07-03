import './showData.scss'
import React from 'react'

type showDataProps = {
    dataKey:string,
    value:string,
}

const ShowData : React.FC<showDataProps> = ({dataKey,value}) => {
    const dataValue = value
    return (
        <div className="dataContainer">
            {
                    dataValue !=="" && (<p className="dataField">{dataKey}:{value}</p>  )
            }
                      
        </div>
    )
}

export default ShowData;