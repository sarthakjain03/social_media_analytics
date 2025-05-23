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
