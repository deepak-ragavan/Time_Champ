import UseAuth from "../hooks/useAuth";
import PublicRoute from "./publicRoute";
import PrivateRoute from "./privateRoute";

const RootRoute = () => {
    const token  = UseAuth();

    return (
        <>
            { token.access_token ? <PrivateRoute /> : <PublicRoute /> }
        </>
    )
}

export default RootRoute;