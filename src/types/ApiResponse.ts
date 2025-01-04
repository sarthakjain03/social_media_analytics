export interface ApiResponse {
    success: boolean;
    message: string;
    data?: { [key: string]: string };
}