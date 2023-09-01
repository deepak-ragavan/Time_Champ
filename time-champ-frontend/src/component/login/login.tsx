import { useState,useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import './login.scss'
import { Link } from "react-router-dom"
import { LoginApi } from "../service/loginApi"
import { saveToken } from "../store/reducer/reducerToken"
import { AxiosError } from "axios";
import loginImage from '../../loginScreen.svg'
import logo from '../../time_tracer.png'
import Button from "@mui/material/Button"
import GoogleIcon from '@mui/icons-material/Google';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TextField from "@mui/material/TextField"
import { setUserId } from "../store/reducer/reducerUserData"
type msgType =  {
    Error : string
}

const Login = () => {
    const errRef = useRef<HTMLParagraphElement | null>(null);

    const[email,setEmail] = useState("")
    const[password,setPassword] = useState("")
    const[errmsg,setErrmsg] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const response = await LoginApi({Email:email,Password:password})
            dispatch(saveToken(response))
            dispatch(setUserId(response.data))
            setEmail('')
            setPassword('')
            navigate("/summary")
        } catch (error) {
            const err = error as AxiosError;
            if(!err?.response) {
                setErrmsg("No Server Response")
            } else if(err.response?.status===400) {
                const msg = err?.response?.data as msgType
                setErrmsg(msg.Error)
            } else if(err.response?.status===401) {
                setErrmsg("unAuthorized")
            } else {
                setErrmsg("Login failed")
            }
            if(errRef.current) errRef.current.focus()
            console.log(err.message)
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
                            <div className="googleSignIn">
                                <h2 className="loginText">Welcome Back</h2>
                                <Button className="googleSignInButton" variant="outlined" color="info" startIcon={<GoogleIcon />} endIcon={<ChevronRightIcon/>}>
                                    Login with Google
                                </Button>
                            </div>
                            <div className="centerTextContainer">
                                <h4 className="centerText">or</h4>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <TextField inputProps={{ inputMode: 'email' }} className="form-control" id="outlined-basic" size="small" margin="dense" label="Email" variant="outlined" onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <TextField className="form-control" id="outlined-basic" size="small" margin="dense" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="forgotPasswordContainer">
                                    <Link className="forgotPassword" to={`/forgotPassword`}>Forgot your password?</Link>
                                </div>
                                <div className="divButton">
                                    <Button className="loginButton" type="submit" variant="contained" >
                                        Login
                                    </Button>
                                </div> 
                            </form>
                            <div className="divLink">
                                <p>Need an account?</p> <Link className="signupButton" to={`/signup`}>signup</Link>
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

export default Login;