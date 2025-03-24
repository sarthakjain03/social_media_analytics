import axios, { AxiosError } from "axios";
import showToast from "../utils/toast";
import { ApiResponse } from "@/types/ApiResponse";
import InstagramDataModel from "@/models/InstagramData";
import UserModel from "@/models/User";

export const getIGLongLivedAccessToken = async (tempAccessToken: string, email: string) => {
    try {
        const params = {
            grant_type: 'ig_exchange_token',
            client_secret: process.env.INSTAGRAM_APP_SECRET as string,
            access_token: tempAccessToken
        };
        const accessTokenResponse = await axios.get('https://graph.instagram.com/access_token', { params })
        console.log("Long lived access token response: ", accessTokenResponse) // TODO: remove

        if (accessTokenResponse?.data?.access_token) {
            // valid for 60 days, can be refreshed only after 24 hours atleast if not expired
            const dbUserUpdate = await axios.post<ApiResponse>(`/api/instagram/add-ig-user`, {
                email: email,
                accessToken: accessTokenResponse?.data?.access_token,
                expiresIn: accessTokenResponse?.data?.expires_in
            })

            return dbUserUpdate?.data?.success
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
        const usableCodeStr = code.slice(0, -2) // removing #_ from the end
        const clientID = process.env.INSTAGRAM_APP_ID as string
        const clientSecret = process.env.INSTAGRAM_APP_SECRET as string
        const redirectUri = process.env.INSTAGRAM_CALLBACK_URI as string

        const formData = new URLSearchParams()
        formData.append('client_id', clientID);
        formData.append('client_secret', clientSecret);
        formData.append('grant_type', 'authorization_code');
        formData.append('redirect_uri', redirectUri);
        formData.append('code', usableCodeStr);

        const response = await axios.post('https://api.instagram.com/oauth/access_token', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        console.log("Short lived access token response: ", response) // TODO: remove

        if (response?.data?.data && response?.data?.data[0]) {
            const accessToken = response?.data?.data[0]?.access_token
            const generatedLongTerm = await getIGLongLivedAccessToken(accessToken, email)
            return generatedLongTerm
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