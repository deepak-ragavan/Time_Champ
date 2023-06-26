import { useState,useRef } from "react"
import './login.scss'
import { SignupApi }  from './Api/loginApi'
import { useDispatch } from "react-redux"
import { useNavigate,Link } from "react-router-dom"
import { saveToken } from "./store/reducer/reducerToken"
import { AxiosError } from "axios"
import logo from '../time_tracer.png'

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
            navigate("/home")
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
    <div className="loginDiv">
    <img alt="logo" src={logo} className="logo"></img><h3 className="appName">S² Time Tracer</h3>
    <div className="container">
        <h3 className="heading">Sign up</h3>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <i className="fas fa-user icon"></i>
                <input type="email" placeholder="Email" className="form-control" name="email" id="email" onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
                <i className="fas fa-lock icon"></i>
                <input type="password" placeholder="Password" className="form-control" name="password" id="password" onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="divButton">
                <button className = "button login__submit">  
                <span className = "button__text"> Sign up </span>  
                <i className = "button__icon fas fa-chevron-right"> </i>  
                </button> 
            </div> 
        </form>
        <div className="divLink">
            Already have an account? <Link to={`/`}>Log in</Link>
        </div>
        <div className="divError">
            <p ref={errRef} className={errmsg ? "errmsg" : "offscreen"} aria-live="assertive">{errmsg}</p>
        </div>      
    </div>
</div>
</div>
} 

export default Signup;
