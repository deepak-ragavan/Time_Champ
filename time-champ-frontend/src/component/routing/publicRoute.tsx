import { Routes,Route,Navigate } from "react-router-dom"
import Login from "../login/login"
import Signup from "../login/signup"
const PublicRoute = () => {
    return (
        <>
            <Routes>
                <Route path="/*" element={<Navigate replace to="/login" />} />
                <Route path='/login' element={<Login/>} />
                <Route path='/signup' element={<Signup />} />
            </Routes>
        </>
    )
}

export default PublicRoute;