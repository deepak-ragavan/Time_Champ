import { Routes,Route } from "react-router-dom"
import Home from "../home/home"
import TimeTracer from "../timetracer/timeTracer"
import Hr from "../hr/hr"
import NavBar from "../navbar/navbar"

const PrivateRoute = () => {
    return (
        <>
            <Routes>
                <Route element={<NavBar />}>
                    <Route path='/home' element={<Home />} />
                    <Route path='/timetracer' element={<TimeTracer />} />
                    <Route path='/hr' element={<Hr/>} />
                </Route>
            </Routes>
        </>
    )
}

export default PrivateRoute;