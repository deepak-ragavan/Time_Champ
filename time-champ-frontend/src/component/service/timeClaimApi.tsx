import useAxiosPrivate from "../hooks/useAxiosPrivate"


export const GetTimeClaimDetails = async(userIds:string,fromDate:string,toDate:string) => {
    const axiosPrivate =useAxiosPrivate()
    const response = await axiosPrivate('user-activity/getTimeClaim-ActivityReport',{ params: { userIds: userIds,fromDate:fromDate,toDate:toDate } })
    return response.data
}