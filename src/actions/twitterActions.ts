import axios, { AxiosError } from "axios";
import showToast from "../utils/toast";
import { ApiResponse } from "@/types/ApiResponse";

export const getAccessToken = async (
  state: string,
  code: string,
  email: string
) => {
    const originalState = process.env.TWITTER_AUTH_STATE as string;
  if (state !== originalState) { // TODO: secure state somehow using bcrypt or something
    showToast("error", "Invalid state for X token generation");
    return;
  }

  try {
    const response = await axios.post<ApiResponse>(`/api/twitter/generate-token`, { code: code, email: email });

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

export const getAuthUrl = async () => {
    try {
        const response = await axios.get<ApiResponse>(`/api/twitter/get-auth-url`);
    
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const message = axiosError.response?.data.message ?? "Error occurred during auth url generation for X account";
        showToast("error", message);
      }
}
