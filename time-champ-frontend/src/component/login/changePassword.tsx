import Button from "@mui/material/Button";
import loginImage from '../../loginScreen.svg'
import logo from '../../time_tracer.png'
import { useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { selectUserDataReducer } from "../store/reducer/reducerUserData";
import { ChangePasswordApi } from "../service/loginApi";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

type msgType =  {
    Error : string
}

const ChangePassword = () => {
    const errRef = useRef<HTMLParagraphElement | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const[errmsg,setErrmsg] = useState('')
    const email = useSelector(selectUserDataReducer).email
    const navigate = useNavigate();

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
            await ChangePasswordApi(email,password,confirmPassword);
            setPassword("")
            setConfirmPassword("")
            navigate("/login")
        } catch(error) {
            const err = error as AxiosError;
            if(!err?.response) {
                setErrmsg("No Server Response")
            } else if(err.response?.status===400) {
                const msg = err?.response?.data as msgType
                setErrmsg(msg.Error)
            } else if(err.response?.status===401) {
                setErrmsg("unAuthorized")
            } else {
                setErrmsg("otp not valid")
            }
            if(errRef.current) errRef.current.focus()
        }
    }

    return <div className="rootlogin">
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
                    <h2 className="forgotPasswordHeading">Change Password</h2>
                    <p className="forgotPasswordText">Enter your new password.</p>
                </div>
                <div className="formContainer">
                    <div className="mb-3">
                        <TextField className="form-control" id="outlined-basic" size="small" margin="dense" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <TextField className="form-control" id="outlined-basic" size="small" margin="dense" label="Confirm Password" variant="outlined" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <div className="divButton">
                        <Button className="loginButton" variant="contained" onClick={(e) => handleSubmit(e)}>
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