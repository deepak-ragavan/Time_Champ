import React from 'react'
type productivityProps = {
  name:string,
  time:string,
  icons:any
}
const DashboardCard = (props:productivityProps) => {
  return (
   <>
       <span>
        <span>
        {props.name}
        </span>

        <img src={props.icons}>
       </img> 
        <span>
        {props.time}
          </span>
         </span> 
     
    </>
  )
}

export default DashboardCard