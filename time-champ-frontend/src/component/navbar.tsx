import { Link,useResolvedPath,useMatch } from "react-router-dom";
import logo from '../time_tracer.png'
import './navbar.scss'

type CustomLinkProps = {
    to: string;
    children: React.ReactNode;
};

const Navbar = () => {
    return <div className="nav">
        <Link to="/">
            <img alt="logo" src={logo} className="logo-nav"></img><h3 className="appName-nav">S² Time Tracer</h3>
        </Link>
        <ul className="topNav">
            <CustomLink to="/setting"><i className="material-icons">settings</i></CustomLink>
            <CustomLink to="/"><i className="fas fa-sign-out-alt logout"></i></CustomLink>
        </ul>
    </div>
}

const CustomLink = ({ to,children,...props }: CustomLinkProps) => {
    const path =  useResolvedPath(to);
    const isActive = useMatch({ path: path.pathname, end: true})

    return (
        <li className={isActive ? "Active" : "inActive"}>
            <Link to={to}{...props}>{children}</Link>
        </li>
    )
}

export default Navbar;