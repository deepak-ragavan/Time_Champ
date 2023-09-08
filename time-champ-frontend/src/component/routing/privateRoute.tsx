import { Routes,Route } from "react-router-dom"
import Project from "../project/project"
import Hr from "../hr/hr"
import Summary from "../summary/summary"
import Timesheet from "../Attendance/attendance"
import Productivity from "../productivity/productivity"
import MyDashboard from "../myDashboard/myDashboard"
import SideNav from "../navbar/sidebar/sidenav"
import Screenshots from "../screenshots/main"
import TimeClaim from "../timeClaim/timeClaim"

const PrivateRoute = () => {
    return (
        <>
            <Routes>
                <Route element={<SideNav />}>
                    <Route path='/project' element={<Project />} />
                    <Route path='/hr' element={<Hr/>} />
                    <Route path="/summary" element={<Summary/>} />
                    <Route path="/timesheet" element={<Timesheet/>} />
                    <Route path="/productivity" element={<Productivity />} />
                    <Route path="/mydashboard" element={<MyDashboard />} />
                    <Route path="/screenshots" element={<Screenshots />} />
                    <Route path="/timeclaim" element={<TimeClaim />} />
                </Route>    
            </Routes>
        </>
    )
}

export default PrivateRoute;