import { useSelector } from "react-redux";
import { selectTokenProfile } from "./store/reducer/reducerToken";
import { useEffect } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";

const Validate = () => {
    const token = useSelector(selectTokenProfile)
    console.log(token);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const responsefun = async () =>{
            try{
                const response = await axiosPrivate.post("/validate",{signal:controller.signal})
                isMounted && console.log(response)
            } catch(error) {
                console.log(error)
            }
        }
        responsefun();

        return () => {
            isMounted = false;
            controller.abort();
        }
    },[axiosPrivate])
    return  <h3>Validate</h3>
}

export default Validate;