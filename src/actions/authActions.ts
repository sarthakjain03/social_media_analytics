import axios, { AxiosError } from "axios";
import showToast from "../utils/toast";
import { Dispatch, SetStateAction } from "react";
import { ApiResponse } from "@/types/ApiResponse";

export const signUpOtp = async (
  email: string,
  setOpenOtpModal?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    const response = await axios.post<ApiResponse>(`/api/auth/otp`, { email: email });

    if (response?.data?.success) {
      if (setOpenOtpModal) {
        setOpenOtpModal(true);
      }
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

export const verifyOtpAndSignUp = async (name: string, email: string, attemptedOtp: number, password: string, onSignUpSuccess: () => void) => {
  try {
    const response = await axios.post<ApiResponse>(`/api/auth/sign-up`, { name: name, email: email, attemptedOtp: attemptedOtp, password: password });
    
    if (response?.data?.success) {
      showToast("success", response?.data?.message);
      onSignUpSuccess();

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

export const checkGoogleUserInDatabase = async (name: string, email: string) => {
  try {
    const response = await axios.post<ApiResponse>(`/api/auth/check-google-user`, { name: name, email: email });

    if (response?.data?.success) {
      return response.data.data;
    }

    return null;
    
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const message =
      axiosError.response?.data.message ?? "Error occurred while checking google user in database";
    showToast("error", message);
  }
}

export const handleForgotPassword = async (email: string, closeModal: () => void) => {
  try {
    const response = await axios.post<ApiResponse>(`/api/auth/forgot-password`, { email: email });

    if (response?.data?.success) {
      showToast("success", response?.data?.message);
      closeModal();

    } else {
      showToast("error", response?.data?.message);
    }
    
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const message =
      axiosError.response?.data.message ?? "Error occurred during forgot password";
    showToast("error", message);
  }
}

export const handleResetLinkValidation = async (token: string) => {
  try {
    const response = await axios.post<ApiResponse>(`/api/auth/validate-reset-link`, { resetToken: token });

    if (response?.data?.success === false) {
      showToast("error", response?.data?.message);
    }

    return response?.data?.success ?? false;   
    
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const message =
      axiosError.response?.data.message ?? "Error occurred during reset password link validation";
    showToast("error", message);
  }
}

export const handleResetPassword = async (token: string, password: string) => {
  try {
    const response = await axios.post<ApiResponse>(`/api/auth/reset-password`, { resetToken: token, newPassword: password });

    if (response?.data?.success) {
      showToast("success", response?.data?.message);

    } else {
      showToast("error", response?.data?.message);
    }

    return response?.data ?? { success: false, message: "Some error occurred. Please try again later" };
    
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const message =
      axiosError.response?.data.message ?? "Error occurred during reset password";
    showToast("error", message);
  }
}

