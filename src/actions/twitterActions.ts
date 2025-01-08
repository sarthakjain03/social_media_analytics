import axios, { AxiosError } from "axios";
import showToast from "../utils/toast";
import { ApiResponse } from "@/types/ApiResponse";

export const getXAccessToken = async (
  state: string,
  code: string,
  email: string
) => {
  try {
    const response = await axios.post<ApiResponse>(`/api/twitter/generate-token`, { state: state, code: code, email: email });

    if (response?.data?.success) {
      return true;
      
    } else {
      showToast("error", response?.data?.message);
    }

    return false;

  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const message = axiosError.response?.data.message ?? "Error occurred during token generation for X account";
    //showToast("error", message);
  }
};

export const updateXUserData = async (email: string) => {
    try {
        const response = await axios.get(`/api/twitter/update-user-data/${email}`);

        return response.data.data?.lastUpdate
    
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const message = axiosError.response?.data.message ?? "Error updating user's X account data";
        //showToast("error", message);
      }
}

export const getXUserData = async (email: string) => {
    try {
        const response = await axios.get(`/api/twitter/get-user-data/${email}`);

        if (response?.data?.success) {
          return response.data.data;
        } else {
          showToast("error", response?.data?.message);
        }

        return null;
    
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const message = axiosError.response?.data.message ?? "Error updating user's X account data";
        //showToast("error", message);
      }
}
