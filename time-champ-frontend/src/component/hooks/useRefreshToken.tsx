import { useDispatch } from "react-redux";
import { saveToken } from "../store/reducer/reducerToken";
import { RefreshTokenApi } from "../service/loginApi";
import UseAuth from "./useAuth";

const RefreshToken = () => {
    const token = UseAuth();
    const dispatch = useDispatch();
    const refresh =  async () => {
        const response = await RefreshTokenApi(token.refresh_token);
        dispatch(saveToken(response));  
        console.log(response) 
        return response;
    }
    return refresh;
};

export default RefreshToken;