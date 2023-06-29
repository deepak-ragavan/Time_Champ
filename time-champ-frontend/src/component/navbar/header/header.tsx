import { Link,useNavigate } from "react-router-dom";
import logo from '../../../time_tracer.png'
import './header.scss'
import CustomLink from "../customlink";
import { useDispatch } from "react-redux";
import { removeToken } from "../../store/reducer/reducerToken";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handlelogout = () => {
        dispatch(removeToken())
        navigate("/login")
    }
    return <div className="nav">
                <Link to="/home">
                    <div className="navlogo">
                        <img alt="logo" src={logo} className="logo-nav"></img>
                        <span className="appName-nav">Sentinel</span>
                    </div>
                </Link>
                <ul className="headerlist">
                    <CustomLink to="/setting"><span className="material-icons-round navicon">settings</span></CustomLink>
                    <button className="logoutbutton" onClick={() => handlelogout()}><span className="material-icons-round navicon">logout</span></button>
                </ul>
        </div>
}

export default Header;

