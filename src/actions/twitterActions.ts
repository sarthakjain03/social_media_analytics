import axios, { AxiosError } from "axios";
import showToast from "../utils/toast";
import { ApiResponse } from "@/types/ApiResponse";

export const getAccessToken = async (
  state: string,
  code: string,
  email: string
) => {
  try {
    const response = await axios.post<ApiResponse>(`/api/twitter/generate-token`, { state: state, code: code, email: email });

    if (response?.data?.success) {
      showToast("success", response?.data?.message);
    } else {
      showToast("error", response?.data?.message);
    }

  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const message = axiosError.response?.data.message ?? "Error occurred during token generation for X account";
    showToast("error", message);
  }
};

export const getUserData = async (email: string) => {
    try {
        const response = await axios.get<ApiResponse>(`/api/twitter/get-user-data/${email}`);

        if (response?.data?.success) {
          showToast("success", response?.data?.message);
        } else {
          showToast("error", response?.data?.message);
        }
    
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const message = axiosError.response?.data.message ?? "Error occurred during auth url generation for X account";
        showToast("error", message);
      }
}
