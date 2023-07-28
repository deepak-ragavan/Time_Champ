import Button from "@mui/material/Button";
import loginImage from '../../loginImage.svg'
import logo from '../../time_tracer.png'
import { useState } from "react";
import TextField from "@mui/material/TextField";
const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
                    <h2 className="forgotPasswordHeading">Change Password</h2>
                    <p className="forgotPasswordText">Enter your new password.</p>
                </div>
                <div className="formContainer">
                    <div className="mb-3">
                        <TextField className="form-control" id="outlined-basic" size="small" margin="dense" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <TextField className="form-control" id="outlined-basic" size="small" margin="dense" label="Password" variant="outlined" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <div className="divButton">
                        <Button className="loginButton" variant="contained" >
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

export default ChangePassword;