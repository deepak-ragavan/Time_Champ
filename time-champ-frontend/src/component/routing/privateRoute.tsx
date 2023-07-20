import { Routes,Route } from "react-router-dom"
import Project from "../project/project"
import TimeTracer from "../timetracer/timeTracer"
import Hr from "../hr/hr"
import NavBar from "../navbar/navbar"
import Summary from "../summary/summary"
import TimeTracerNav from "../navbar/timetrackerbar/timetracernav"
import Timesheet from "../timesheet/timesheet"

const PrivateRoute = () => {
    return (
        <>
            <Routes>
                <Route element={<NavBar />}>
                    <Route path='/timetracer' element={<TimeTracer />} />
                    <Route path='/project' element={<Project />} />
                    <Route path='/hr' element={<Hr/>} />
                    <Route element={<TimeTracerNav />}>
                        <Route path="/summary" element={<Summary/>} />
                        <Route path="/timesheet" element={<Timesheet/>} />
                    </Route>
                </Route>    
            </Routes>
        </>
    )
}

export default PrivateRoute;