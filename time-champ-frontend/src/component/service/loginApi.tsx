import { useDispatch } from "react-redux";
import apiClient from "./apiClient";
import { removeToken } from "../store/reducer/reducerToken";


type userData =  {
    Email:string,
    Password:string,        
}

export const LoginApi = async (data : userData) =>{
    return await apiClient.post("/login",data)     
}

export const SignupApi = async (data : userData) =>{
      console.log("signupin")
      return await apiClient.post("/signup",data)
}

export const RefreshTokenApi = async (refreshToken:string) =>{
   try {
     return await apiClient.post("/refresh",{refresh_token:refreshToken})
    } catch(error: any) {
       console.log(error.message);
    }
}

export const ForgotPasswordApi = async (email : string) =>{
    return await apiClient.get("/send-otp",{params:{email:email}})     
}

export const VerifyOtpAndChangePassword = async (email:string,otp : string) =>{
    return await apiClient.get("/verify-otp",{params:{email:email,otp:otp}})     
}

export const ChangePasswordApi = async (email:string,password:string,confirmPassword:string) => {
    return await apiClient.post("/resetpassword",{email:email,password:password,confirmPassword:confirmPassword})
}