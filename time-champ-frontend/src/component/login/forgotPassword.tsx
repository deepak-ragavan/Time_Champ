import { useRef, useState } from "react";
import loginImage from '../../loginImage.svg'
import logo from '../../time_tracer.png'
import './forgotPassword.scss'
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const errRef = useRef<HTMLParagraphElement | null>(null);
    const[errmsg,setErrmsg] = useState('')
    const[email,setEmail] = useState("")
    const navigate = useNavigate();

    return  <div className="rootlogin">
                <div className="before"></div>
                <div className="loginContainer">
                    <div className="loginDiv">
                        <div className="container">
                            <div className={errmsg ? "divError" : "offscreen"}>
                                <p ref={errRef} aria-live="assertive" className="errmsg">{errmsg}</p>
                                <span onClick={() => setErrmsg("")} className="material-icons-round close-icon">close</span>
                            </div>
                            <div className="logoDiv">
                                <img alt="logo" src={logo} className="logo"></img>
                                <h3 className="appName">Sentinel</h3>
                            </div>
                            <div className="contentContainer">
                                <h2 className="forgotPasswordHeading">Reset Password</h2>
                                <p className="forgotPasswordText">Enter the email address associated with your Sentinel account.</p>
                            </div>
                            <div className="formContainer">
                                <div className="mb-3">
                                        <TextField className="form-control" id="outlined-basic" size="small" margin="dense" label="Email" variant="outlined" onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="divButton">
                                    <Button className="loginButton" onClick={()=>navigate("/verifyotp")} variant="contained" >
                                        Send OTP
                                    </Button>
                                    <Button className="loginButton" onClick={()=>navigate("/login")}  variant="contained" >
                                        Back to Login Page
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

export default ForgotPassword;