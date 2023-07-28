import Button from "@mui/material/Button";
import loginImage from '../../loginImage.svg'
import logo from '../../time_tracer.png'
import OtpInput from 'react-otp-input';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    return <div className="rootlogin">
    <div className="before"></div>
    <div className="loginContainer">
        <div className="loginDiv">
            <div className="container">
                <div className="logoDiv">
                    <img alt="logo" src={logo} className="logo"></img>
                    <h3 className="appName">Sentinel</h3>
                </div>
                <div className="contentContainer">
                    <h2 className="forgotPasswordHeading">Reset Password</h2>
                    <p className="forgotPasswordText">Enter your otp that you received in your email.</p>
                </div>
                <div className="formContainer">
                    <div className="mb-3">
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props} />}
                        />
                    </div>
                    <div className="divButton">
                        <Button className="loginButton" onClick={()=>navigate("/changePassword")}  variant="contained" >
                            submit
                        </Button>
                    </div> 
                </div>
            </div>
        </div>
        <div className="sideImage">
            <img className="loginSideImage" src={loginImage} alt="" />
        </div>
    </div>
    <div className="after"></div>
 </div>
}

export default VerifyOtp;