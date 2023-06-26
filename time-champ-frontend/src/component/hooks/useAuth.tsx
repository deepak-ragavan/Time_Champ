import { useSelector } from "react-redux";
import { selectTokenProfile } from "../store/reducer/reducerToken";

const UseAuth = () => {
    const token = useSelector(selectTokenProfile);
    return token;
}

export default UseAuth