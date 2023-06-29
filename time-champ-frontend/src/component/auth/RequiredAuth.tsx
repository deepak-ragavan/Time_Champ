import { useLocation,Outlet, Navigate } from "react-router-dom";
import UseAuth from '../hooks/useAuth'
import Navbar from "../sidebar/navbar";

const RequiredAuth = () => {
    const token  = UseAuth();
    const location = useLocation();
    return (
        token?.access_token!==""
        ? <>
            <Navbar />
            <Outlet />
          </>
        : <Navigate to="/login" state={{from: location}} replace />
    );
}

export default RequiredAuth;