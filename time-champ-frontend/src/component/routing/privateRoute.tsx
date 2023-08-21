import { Routes,Route } from "react-router-dom"
import Project from "../project/project"
import TimeTracer from "../timetracer/timeTracer"
import Hr from "../hr/hr"
import NavBar from "../navbar/navbar"
import Summary from "../summary/summary"
import TimeTracerNav from "../navbar/timetrackerbar/timetracernav"
import Timesheet from "../timesheet/timesheet"
import Productivity from "../productivity/productivity"
import MyDashboard from "../myDashboard/myDashboard"

const PrivateRoute = () => {
    return (
        <>
            <Routes>
                <Route element={<NavBar />}>
                    <Route path='/timetracer' element={<TimeTracer />} />
                    <Route path='/project' element={<Project />} />
                    <Route path='/hr' element={<Hr/>} />
                    <Route path="/summary" element={<Summary/>} />
                    <Route path="/timesheet" element={<Timesheet/>} />
                    <Route path="/productivity" element={<Productivity />} />
                    <Route path="/mydashboard" element={<MyDashboard />} />
                </Route>    
            </Routes>
        </>
    )
}

export default PrivateRoute;