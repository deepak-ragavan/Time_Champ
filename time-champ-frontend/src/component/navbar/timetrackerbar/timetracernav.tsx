import CustomLink from "../customlink"
import { Outlet } from "react-router-dom"
import './timetracernav.scss'

const TimeTracerNav = () => {
    return <div className="timetracer">
            <div className="timetracernav">
                <ul className="timetracernavlist">
                    <CustomLink to="/summary">
                        <div className="timetracernavitems">    
                            <span className="material-icons-round timetracernavicon">dashboard</span>
                            <span className="navtext">Summary</span>  
                        </div>
                    </CustomLink>
                    <CustomLink to="/timesheet">
                        <div className="timetracernavitems">    
                            <span className="material-icons-round timetracernavicon">punch_clock</span>
                            <span className="navtext">Timesheet</span>  
                        </div>
                    </CustomLink>
                    <CustomLink to="/productivity">
                        <div className="timetracernavitems">    
                            <span className="material-icons-round timetracernavicon">analytics</span>
                            <span className="navtext">Productivity</span>  
                        </div>
                    </CustomLink>
                    <CustomLink to="/productivity">
                        <div className="timetracernavitems">    
                            <span className="material-icons-round timetracernavicon">timeline</span>
                            <span className="navtext">Timeline</span>  
                        </div>
                    </CustomLink>
                    <CustomLink to="/productivity">
                        <div className="timetracernavitems">    
                            <span className="material-icons-round timetracernavicon">screenshot_monitor</span>
                            <span className="navtext">Screenshots</span>  
                        </div>
                    </CustomLink>
                    <CustomLink to="/productivity">
                        <div className="timetracernavitems">    
                            <span className="material-icons-round timetracernavicon">apps</span>
                            <span className="navtext">My Dashboard</span>  
                        </div>
                    </CustomLink>
                    <CustomLink to="/productivity">
                        <div className="timetracernavitems">    
                            <span className="material-icons-round timetracernavicon">summarize</span>
                            <span className="navtext">Reports</span>  
                        </div>
                    </CustomLink>
                </ul>
        </div>
        <Outlet />
    </div>
}

export default TimeTracerNav;