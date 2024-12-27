import axios, { AxiosError } from "axios";
import showToast from "./toast";
import { Dispatch, SetStateAction } from "react";
import { ApiResponse } from "@/types/ApiResponse";

export const userSignUp = async (
  email: string,
  setOpenOtpModal: Dispatch<SetStateAction<boolean>>
) => {
  try {
    const response = await axios.post<ApiResponse>(`/api/sign-up`, { email: email });
    console.log("Sign up api response: ", response); // TODO: to remove this console log
    if (response?.data?.success) {
      setOpenOtpModal(true);
      showToast("success", response?.data?.message);
    } else {
      showToast("error", response?.data?.message);
    }

  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const message =
      axiosError.response?.data.message ?? "Error occurred during Sign Up";
    showToast("error", message);
  }
};

export const verifyOTP = async (name: string, email: string, attemptedOtp: number, password: string, onSignUpSuccess: () => void) => {
  try {
    const response = await axios.post<ApiResponse>(`/api/verify-otp`, { name: name, email: email, attemptedOtp: attemptedOtp, password: password });
    console.log("Verify Otp api response: ", response); // TODO: to remove this console log
    if (response?.data?.success) {
      showToast("success", response?.data?.message);
      onSignUpSuccess();

      // TODO: log the user in

    } else {
      showToast("error", response?.data?.message);
    }

  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const message =
      axiosError.response?.data.message ?? "Error occurred during OTP verification";
    showToast("error", message);
  }
};
