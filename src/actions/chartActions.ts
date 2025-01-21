import axios, { AxiosError } from "axios";
import showToast from "../utils/toast";
import { ApiResponse } from "@/types/ApiResponse";

export const getUserChartsAndCardsData = async (email: string) => {
    try {
        const response = await axios.get(`/api/charts/get-user-data/${email}`);

        if (response?.data?.success) {
          return response.data.data;
        } else {
          showToast("error", response?.data?.message);
        }

        return null;
    
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const message = axiosError.response?.data.message ?? "Error retrieving user charts and cards data";
        //showToast("error", message);
      }
}

export const updateCardsData = async (email: string) => {
    try {
        const response = await axios.get(`/api/charts/update-cards-data/${email}`);

        if (response?.data?.success === false) {
          showToast("error", response?.data?.message);
        }
    
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const message = axiosError.response?.data.message ?? "Error updating user cards data";
        //showToast("error", message);
      }
};
