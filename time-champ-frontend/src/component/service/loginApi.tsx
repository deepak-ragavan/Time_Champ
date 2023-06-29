import apiClient from "./apiClient";


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