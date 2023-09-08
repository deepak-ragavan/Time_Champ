import { axiosPrivate } from "./apiClient"

export const user = async (userId: string) => {
    const response = await axiosPrivate.get('users', { params: { userId: userId } });
    return response.data
}

export const getMyTeamMembersList = async (userId: string| number) => {
    const response = await axiosPrivate.get('user/getMyTeamMembersList', { params: { userId: userId } })
    return response.data
}

export const getMyTeamMemberIds = async (userId: number) => {
    const response = await axiosPrivate.get('user/getMyTeamMemberIds', { params: { userId: userId } })
    return response.data
}