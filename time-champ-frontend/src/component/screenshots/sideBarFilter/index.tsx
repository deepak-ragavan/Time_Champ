import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import './index.scss'


const SideBarFilter = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div> 
      <Button onClick={() => setIsOpen(true)} className='sideBarFilterButton' variant="contained">Filter</Button> 
      <div className={isOpen ? "sideBarFilterNavContainer" : "sideBarFilterNavContainer Active" }>
        <div className="sideBarFilterCloseIcon" onClick={()=>setIsOpen(false)}><CloseIcon /></div>
        <div className="sideBarFilterList">
           {children.length !== undefined ?
             children.map(
             (child:any) =>{
                return(
                  <div className='sideBarFilterChild'>
                    {child}
                  </div>
                )
              }
             )
            :
            <div className='sideBarFilterChild'>
            {children}
            </div>
            }
        </div>
        
    </div>
    </div>
  )
}

export default SideBarFilter