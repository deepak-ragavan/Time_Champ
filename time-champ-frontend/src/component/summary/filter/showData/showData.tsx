import './showData.scss'
import React from 'react'

type showDataProps = {
    dataKey:string,
    value:string,
    setSelected:(val:any)=>void
}

const ShowData : React.FC<showDataProps> = ({dataKey,value,setSelected}) => {
    const dataValue = value
    const fixedData = ["From Date","To Date"]
    const clearData = () => {
        if(dataKey==="Branch") {
            setSelected([])
        } else if(dataKey==="Department") {
            setSelected([])
        } else if(dataKey==="Role") {
            setSelected([])
        } else if(dataKey==="Search") {
            setSelected("")
        } else if(dataKey==="User") {
            setSelected(null)
        } else if(dataKey==="LineManager") {
            setSelected([])
        }
    }
    return (
        <>
             {
                    dataValue !=="" && ( fixedData.includes(dataKey) 
                    ? <div className="dataContainer"><p className="dataField">{dataKey}:{value}</p></div>
                    :  <div className="dataContainer">
                            <div className='datashow'> 
                                <p>{dataKey}:{value}</p>  
                                <button onClick={clearData}><span className="material-icons-round">close</span></button>
                            </div>
                        </div>
                    )
            }
        </>
    )
}

export default ShowData;