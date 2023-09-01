import { useEffect, useMemo, useState } from "react"
import "./dataTable.scss"
import DataContainer from "./datacontainer"

type productivityDataProps = {
    productive:number,
    unproductive:number,
    neutral:number,
    idle:number,
    working: number,
    date:string,
    startTime:string,
    endTime: string,
}
type productivityProps = {
    name:string,
    id:number
    productivity:productivityDataProps[]
}

type userProps = {
    id: number,
    name: string,
    role: string
}

const DataTable : React.FC<{datas:productivityProps[],showIdleTimeData:boolean,selectedUserDropDown:userProps,setSelectedUserDropDown:(value:userProps)=>void,users:userProps[]}> = ({datas,showIdleTimeData,selectedUserDropDown,setSelectedUserDropDown,users}) => {
    const data = useMemo(() => {
        const test = datas.find((temp:productivityProps)=> { return temp.name === selectedUserDropDown.name })
        if(test){
            document.querySelector("#user"+selectedUserDropDown.id.toString())?.scrollIntoView();
            return test.productivity
        }
        return []
    },[selectedUserDropDown,datas])

    return (
        <div className="productivityData">
            <div className="UsersList">
                <h4>Users</h4>
                {
                    datas.map((value) => (
                    <div className="users" id={"user"+value.id.toString()} onClick={()=>{setSelectedUserDropDown(users.find((user:userProps)=>user.id===value.id)!)}}>
                        <button className={value.name===selectedUserDropDown.name ? "usersButton Active" : "usersButton inActive" } >{value.name}</button>
                    </div>
                    ))
                }
            </div>
            <div className="weeklyData">
                <div className="data">
                    {
                        data ? <DataContainer datas={data} showIdleTimeData={showIdleTimeData} />
                             : (<p className='NoContent'>No data to display</p>)
                    }
                </div>
                   
            </div>
        </div>
    )
}

export default DataTable;