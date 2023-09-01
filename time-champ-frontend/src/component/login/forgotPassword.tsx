import { useRef, useState } from "react";
import loginImage from '../../loginScreen.svg'
import logo from '../../time_tracer.png'
import './forgotPassword.scss'
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { ForgotPasswordApi } from "../service/loginApi";
import { useDispatch } from "react-redux";
import { setUserEmail } from "../store/reducer/reducerUserData";
type msgType =  {
    error : string
}
const ForgotPassword = () => {
    const errRef = useRef<HTMLParagraphElement | null>(null);
    const[errmsg,setErrmsg] = useState('')
    const[email,setEmail] = useState("")
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
            await ForgotPasswordApi(email)
            dispatch(setUserEmail(email))
            setEmail('')
            navigate("/verifyotp")
        } catch(error) {
            const err = error as AxiosError;
            if(!err?.response) {
                setErrmsg("No Server Response")
            } else if(err.response?.status===400) {
                const msg = err?.response?.data as msgType
                setErrmsg(msg.error)
            } else if(err.response?.status===401) {
                setErrmsg("unAuthorized")
            } else {
                setErrmsg("Email not valid")
            }
            if(errRef.current) errRef.current.focus()
        }
    }

    return  <div className="rootlogin">
                <div className="before"></div>
                <div className={errmsg ? "divError" : "offscreen"}>
                    <p ref={errRef} aria-live="assertive" className="errmsg">{errmsg}</p>
                    <span onClick={() => setErrmsg("")} className="material-icons-round close-icon">close</span>
                </div>
                <div className="loginContainer">
                    <div className="loginDiv">
                        <div className="container">
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
                                    <Button className="loginButton" onClick={(e) => handleSubmit(e)} variant="contained" >
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