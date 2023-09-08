import { Outlet, useNavigate } from "react-router-dom";
import CustomLink from "../customlink";
import './sidenav.scss';
import logo from '../../../time_tracer.png'
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDataReducer } from "../../store/reducer/reducerUserData"; 
import { removeToken } from "../../store/reducer/reducerToken";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export const SideNav = () => {
    const [isShowDetailedNav,setIsShowDetailedNav] = useState(false)
    const [userName,setUserName] = useState("")
    const [userEmail,setUserEmail] = useState("")
    const axiosPrivate = useAxiosPrivate();
    const userId = useSelector(selectUserDataReducer).id;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const response = await axiosPrivate.get("/userdetails",{params:{userId:userId}})
                setUserName(response.data.name)
                setUserEmail(response.data.email)
            } catch(error) {
                setUserName("")
                setUserEmail("")
            }
        }
        getUserDetails()
    },[])

    

    const handlelogout = () => {
        dispatch(removeToken())
        navigate("/login")
    }

    return <main className={isShowDetailedNav ? "main" : "main Active"}>
        <div className="mainContainer">
            <section className="sidenav">
                <div className="navlogo">
                    <div className="nav-logo">
                        <img onClick={()=>setIsShowDetailedNav(true)} alt="logo" src={logo} className="logo-nav"></img>
                        <span className="appName-nav">Sentinel</span>
                    </div>
                    {isShowDetailedNav && <span className="material-icons-round closeNav" onClick={()=>setIsShowDetailedNav(false)}>west</span>}
                </div>
                <div className="listcontainer">
                    <ul onClick={()=>setIsShowDetailedNav(true)}>
                        <CustomLink to="/mydashboard">
                            <div className="navitems">    
                                <span className="material-icons-round vertical">dashboard</span>
                                <span className="navdiscription">My Dashboard</span>
                            </div>
                        </CustomLink>
                        <CustomLink to="/timesheet">
                            <div className="navitems">    
                                <span className="material-icons-round vertical">punch_clock</span>
                                <span className="navdiscription">Attendance</span>
                            </div>
                        </CustomLink>
                        <CustomLink to="/productivity">
                            <div className="navitems">    
                                <span className="material-icons-round vertical">analytics</span>
                                <span className="navdiscription">Productivity</span>
                            </div>
                        </CustomLink>
                        <CustomLink to="/summary">
                            <div className="navitems">    
                                <span className="material-icons-round vertical">summarize</span>
                                <span className="navdiscription">Summary</span>
                            </div>
                        </CustomLink>
                        <CustomLink to="/screenshots">
                            <div className="navitems">    
                                <span className="material-icons-round vertical">screenshot_monitor</span>
                                <span className="navdiscription">Screenshots</span>
                            </div>
                        </CustomLink>
                        <CustomLink to="/project">
                            <div className="navitems">    
                                <span className="material-icons-round vertical">business_center</span>
                                <span className="navdiscription">Project</span>
                            </div>
                        </CustomLink>
                        <CustomLink to="/hr">
                            <div className="navitems">    
                                <span className="material-icons-round vertical">account_box</span>
                                <span className="navdiscription">HR</span>
                            </div>
                        </CustomLink>
                        <CustomLink to="/timeclaim">
                            <div className="navitems">    
                                <span className="material-icons-round vertical">manage_history</span>
                                <span className="navdiscription">Time Claim</span>
                            </div>                           
                        </CustomLink>
                    </ul>
                    <ul onClick={()=>setIsShowDetailedNav(true)}>
                        <li className="list">
                            <div className="navitems" onClick={handlelogout}>
                                <ExitToAppIcon/>
                                <span className="navdiscription">Logout</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    <Outlet />
    </main>
}

export default SideNav;