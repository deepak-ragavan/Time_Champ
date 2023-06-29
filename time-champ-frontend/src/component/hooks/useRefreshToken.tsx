import { useSelector,useDispatch } from "react-redux";
import { saveToken, selectTokenProfile } from "../store/reducer/reducerToken";
import { RefreshTokenApi } from "../service/loginApi";

const RefreshToken = () => {
    const token = useSelector(selectTokenProfile);
    const dispatch = useDispatch();
    const refresh =  async () => {
        const response = await RefreshTokenApi(token.refresh_token);
        dispatch(saveToken(response));   
        return response;
    }
    return refresh;
};

export default RefreshToken;