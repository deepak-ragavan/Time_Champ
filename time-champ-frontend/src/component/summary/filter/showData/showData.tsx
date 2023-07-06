import { useDispatch } from 'react-redux'
import './showData.scss'
import React from 'react'
import { removeBranch, removeDepartment, removeRole, removeSearch } from '../../../store/reducer/reducerFilter'

type showDataProps = {
    dataKey:string,
    value:string,
}

const ShowData : React.FC<showDataProps> = ({dataKey,value}) => {
    const dataValue = value
    const fixedData = ["From Date","To Date"]
    const dispatch = useDispatch()
    const clearData = () => {
        if(dataKey==="Branch") {
            dispatch(removeBranch())
        } else if(dataKey==="Department") {
            dispatch(removeDepartment())
        } else if(dataKey==="Role") {
            dispatch(removeRole())
        } else if(dataKey==="Search") {
            dispatch(removeSearch())
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