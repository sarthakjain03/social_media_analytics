import axios, { AxiosError } from "axios";
import showToast from "../utils/toast";
import { ApiResponse } from "@/types/ApiResponse";
import InstagramDataModel from "@/models/InstagramData";
import UserModel from "@/models/User";

export const getIGLongLivedAccessToken = async (tempAccessToken: string, email: string) => {
    try {
        const response = await axios.post<ApiResponse>(`/api/instagram/add-ig-user`, {
            accessToken: tempAccessToken,
            email: email
        })

        if (response?.data?.success) {
            return true
        }

        return false
        
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.error("Error generating IG long lived access token: ", axiosError)
        const message = axiosError.response?.data.message ?? "Error occurred during long lived token generation for Instagram account";
        return false;
        //showToast("error", message);
    }
}

export const getIGShortLivedAccessToken = async (code: string, email: string) => {
    try {
        const response = await axios.post<ApiResponse>(`/api/instagram/generate-token`, { code: code });

        if (response?.data?.success && response?.data?.data?.accessToken) {
            const longLivedResponse = await getIGLongLivedAccessToken(response?.data?.data?.accessToken, email);

            return longLivedResponse;
        }

        return false
        
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.error("Error generating IG access token: ", axiosError)
        const message = axiosError.response?.data.message ?? "Error occurred during token generation for Instagram account";
        return false
        //showToast("error", message);
    }
}