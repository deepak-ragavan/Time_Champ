import { useSelector } from "react-redux";
import { selectTokenProfile } from "../store/reducer/reducerToken";

export interface IUserProfile {
    access_token: string;
    refresh_token: string;
    access_token_expiry: number;
    refresh_token_expiry: number;
    id:number
}
  
const initialState: IUserProfile = {
    access_token: "",
    refresh_token: "",
    access_token_expiry: 0,
    refresh_token_expiry: 0,
    id:0,
};

const UseAuth = () => {
    const token = useSelector(selectTokenProfile);
    // const tokenObject = localStorage.getItem("tokenDetails")
    // let token = initialState
    // if(tokenObject!==null) {
    //     token = JSON.parse(tokenObject);
    // }
    return token;
}

export default UseAuth