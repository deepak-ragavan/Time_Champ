import { useState,useRef } from "react"
import { SignupApi } from "../service/loginApi"
import { useDispatch } from "react-redux"
import { useNavigate,Link } from "react-router-dom"
import { saveToken } from "../store/reducer/reducerToken"
import { AxiosError } from "axios"
import logo from '../../time_tracer.png'
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import loginImage from '../../loginImage.svg'
import GoogleIcon from '@mui/icons-material/Google';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

type msgType =  {
    error : string
}

const Signup = () => {
    const errRef = useRef<HTMLParagraphElement | null>(null);

    const[email,setEmail] = useState("")
    const[password,setPassword] = useState("")
    const[errmsg,setErrmsg] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            console.log("signupin")
            const response = await SignupApi({Email:email,Password:password})
            dispatch(saveToken(response));
            navigate("/summary")
        } catch (error) {
            const err = error as AxiosError;
            if(!err?.response) {
                setErrmsg("No Server Response")
            } else if(err.response?.status===400) {
                const msg = err?.response?.data as msgType
                setErrmsg(msg.error)
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
                                    <TextField className="form-control" id="outlined-basic" size="small" margin="dense" label="Email" variant="outlined" onChange={e => setEmail(e.target.value)} />
                                    {/* <span className="material-icons-round icon">person</span>
                                    <input type="email" placeholder="Email" className="form-control" name="email" id="email" onChange={e => setEmail(e.target.value)} /> */}
                                </div>
                                <div className="mb-3">
                                    <TextField className="form-control" id="outlined-basic" size="small" margin="dense" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
                                {/* <span className="material-icons-round icon">lock</span>
                                    <input type="password" placeholder="Password" className="form-control" name="password" id="password"
                                        onChange={(e) => setPassword(e.target.value)} pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$" title="Password must be at least 8 characters long and contain at least one letter, one number, and one special character (@, $, !, %, *, #, ?, or &)." required /> */}
                                </div>
                                <div className="divButton">
                                    <Button className="loginButton" type="submit" variant="contained" >
                                        SignUp
                                    </Button>
                                </div> 
                            </form>
                            <div className="divLink">
                                <p>Already have an account?</p> <Link className="signupButton" to={`/login`}>Login</Link>
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

export default Signup;
