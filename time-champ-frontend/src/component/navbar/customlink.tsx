import { useResolvedPath,useMatch } from "react-router-dom";
import { Link } from "react-router-dom";

type CustomLinkProps = {
    to: string;
    children: React.ReactNode;
};

const CustomLink = ({ to,children,...props }: CustomLinkProps) => {
    const path =  useResolvedPath(to);
    const isActive = useMatch({ path: path.pathname, end: true})

    return (
        <li className={isActive ? "Active list" : "inActive list"}>
            {
                to!=="" ? (<Link to={to}{...props}>{children}</Link>) : <>{children}</>
            }
        </li>
    )
}

export default CustomLink;