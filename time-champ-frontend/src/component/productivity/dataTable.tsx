import { useMemo, useState } from "react"
import "./dataTable.scss"
import DataContainer from "./datacontainer"

type productivityDataProps = {
    Productive:number,
    Unproductive:number,
    Neutral:number,
    Idle:number,
    Working: number,
    StartTime:string,
    EndTime: string,
}
type productivityProps = {
    name:string,
    productivity:productivityDataProps[]
}

const DataTable : React.FC<{datas:productivityProps[],showIdleTimeData:boolean,weekDatesArray:string[]}> = ({datas,showIdleTimeData,weekDatesArray}) => {
    const [selected, setSelected] = useState(datas[0].name);
    const data = useMemo(() => {
        console.log("selected",selected, datas)
        const test = datas.find((temp:productivityProps)=> { return temp.name === selected })
        if(test){
            return test.productivity
        }
        return []
    },[selected, datas])
    console.log(data,"datatableee")
    return (
        <div className="productivityData">
            <div className="UsersList">
                <h4>Users</h4>
                {
                    datas.map((value) => (
                    <div className="users" onClick={()=>{setSelected(value.name)}}>
                        <button className="usersButton">{value.name}</button>
                    </div>
                    ))
                }
            </div>
            <div className="weeklyData">
                <div className="data">
                    {
                        data ? <DataContainer datas={data} showIdleTimeData={showIdleTimeData} weekDatesArray={weekDatesArray} />
                             : (<p className='NoContent'>No data to display</p>)
                    }
                </div>
                   
            </div>
        </div>
    )
}

export default DataTable;