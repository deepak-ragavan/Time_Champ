import './verifyotp.scss'
import Button from "@mui/material/Button";
import loginImage from '../../loginScreen.svg'
import logo from '../../time_tracer.png'
import OtpInput from 'react-otp-input';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { selectOtpTimerReducer, setTimer } from '../store/reducer/reducerOtpTimer';
import { AxiosError } from 'axios';
import { ForgotPasswordApi, VerifyOtpAndChangePassword } from '../service/loginApi';
import { selectUserDataReducer } from '../store/reducer/reducerUserData';
type msgType =  {
    Error : string
}
const VerifyOtp = () => {
    const errRef = useRef<HTMLParagraphElement | null>(null);
    const[errmsg,setErrmsg] = useState('')
    const [otp, setOtp] = useState('');
    const seconds = useSelector(selectOtpTimerReducer)
    const email = useSelector(selectUserDataReducer).email
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isFirstLoad,setIsFirstLoad] = useState(true);
    useEffect(() => {
        if(isFirstLoad) {
            dispatch(setTimer(0))
            setIsFirstLoad(false)
        }
        const interval = setInterval(() => {
          if (seconds > 0) {
            dispatch(setTimer(seconds - 1))
          }
          if (seconds === 0) {
              clearInterval(interval);
          }
        }, 1000);
    
        return () => {
          clearInterval(interval);
        };
      });

    const resendOTP = async (e:any) => {
        e.preventDefault();
        try {
            await ForgotPasswordApi(email)
            dispatch(setTimer(59))
        } catch(error) {
            const err = error as AxiosError;
            if(!err?.response) {
                setErrmsg("No Server Response")
            } else if(err.response?.status===403) {
                const msg = err?.response?.data as msgType
                setErrmsg(msg.Error)
            } else if(err.response?.status===401) {
                setErrmsg("unAuthorized")
            } else {
                setErrmsg("Server Error")
            }
            if(errRef.current) errRef.current.focus()
        }
    };

    const handleOtpSubmit = async (e:any) => {
        e.preventDefault();
        try {
            await VerifyOtpAndChangePassword(email,otp);
            setOtp('')
            navigate("/changePassword")
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
                    <h2 className="forgotPasswordHeading">Reset Password</h2>
                    <p className="forgotPasswordText">Enter your otp that you received in your email.</p>
                </div>
                <div className="formContainer">
                    <div className="otpContainer">
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderInput={(props) => <input  {...props} />}
                        />
                    </div>
                    <div className='resendotp'>
                        {
                            seconds > 0 ? (<p className='timing'>{seconds}s</p>) : (
                                <>
                                    <p className='afterTimingEnd'>Didn't receive otp?</p>
                                    <p className='resendOtpButton' onClick={(e) => resendOTP(e)}>Resend OTP</p>
                                </>
                            )
                        }
                    </div>
                    <div className="divButton">
                        <Button disabled={otp.length < 6} className={otp.length < 6?"diabaledLoginButton":"loginButton"} onClick={(e)=>handleOtpSubmit(e)}  variant="contained" >
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