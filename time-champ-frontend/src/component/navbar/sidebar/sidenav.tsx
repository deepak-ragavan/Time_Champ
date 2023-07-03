import { Outlet } from "react-router-dom";
import CustomLink from "../customlink";
import './sidenav.scss';

export const SideNav = () => {
    return <main className="main">
        <section className="sidenav">
        <ul>
            <CustomLink to="/timetracer">
                <div className="navitems">    
                    <span className="material-icons-round vertical">av_timer</span>
                    <span className="navdiscription">Time Tracer</span>  
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
        </ul>
    </section>
    <Outlet />
    </main>
}

export default SideNav;