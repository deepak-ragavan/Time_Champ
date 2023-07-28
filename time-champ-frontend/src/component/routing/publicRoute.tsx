import { Routes,Route,Navigate } from "react-router-dom"
import Login from "../login/login"
import Signup from "../login/signup"
import ForgotPassword from "../login/forgotPassword"
import VerifyOtp from "../login/verifyotp"
import ChangePassword from "../login/changePassword"
const PublicRoute = () => {
    return (
        <>
            <Routes>
                <Route path="/*" element={<Navigate replace to="/login" />} />
                <Route path='/login' element={<Login/>} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/forgotPassword' element={<ForgotPassword />} />
                <Route path='/verifyotp' element={<VerifyOtp />} />
                <Route path="/changePassword" element={<ChangePassword />}/>
            </Routes>
        </>
    )
}

export default PublicRoute;