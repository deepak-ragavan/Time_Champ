import { axiosPrivate } from "../service/apiClient";
import { useEffect } from "react";
import UseAuth from "./useAuth";
import RefreshToken from "./useRefreshToken";
import { removeToken } from "../store/reducer/reducerToken";
import { useDispatch } from "react-redux";

const useAxiosPrivate = () => {
    const token = UseAuth();
    const refresh = RefreshToken();
    const dispatch = useDispatch();

    useEffect(() => {
        const requestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token.access_token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if(error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    try {
                        const response = await refresh();
                        prevRequest.headers['Authorization'] = `Bearer ${response?.data.access_token}`;
                        return axiosPrivate(prevRequest);
                    } catch (refreshError) {
                        // If the refresh token request also fails, log the user out
                        // localStorage.removeItem("tokenDetails")
                           dispatch(removeToken())
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
        return() => {
            axiosPrivate.interceptors.response.eject(responseInterceptor);
            axiosPrivate.interceptors.response.eject(requestInterceptor);
        }
    },[token,refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;