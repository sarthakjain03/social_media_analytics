"use client"
import { X, Instagram, YouTube, LinkedIn } from "@mui/icons-material";
import { useUserStore } from "@/store/user"
import { useRouter } from "next/navigation";

const AccountLinkButtons = () => {
    const { isInstagramConnected, isLinkedinConnected, isXConnected, isYoutubeConnected } = useUserStore();
    const router = useRouter();

    const getXUrlAndRedirect = () => {
        // if (typeof window !== "undefined") {
        //     window.location.href = "/api/twitter/get-auth-url";
        // }
        router.push("/api/twitter/get-auth-url");
    };

  return (
    <div className="flex gap-4 items-center justify-center flex-wrap my-3">
        {!isXConnected && (
            <button onClick={getXUrlAndRedirect} className="rounded-lg bg-black text-white font-poppins font-medium flex gap-2 py-2 px-3 items-center">
                <span>Link</span>
                <span><X fontSize="small" /></span>
                <span>Account</span>
            </button>
        )}
        {!isLinkedinConnected && (
            <button onClick={() => {}} className="rounded-lg bg-blue-500 text-white font-poppins font-medium flex gap-2 py-2 px-3 items-center">
                <span>Link</span>
                <span><LinkedIn /></span>
                <span>Account</span>
            </button>
        )}
        {!isInstagramConnected && (
            <button onClick={() => {}} className="rounded-lg bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white font-poppins font-medium flex gap-2 py-2 px-3 items-center">
                <span>Link</span>
                <span><Instagram /></span>
                <span>Account</span>
            </button>
        )}
        {!isYoutubeConnected && (
            <button onClick={() => {}} className="rounded-lg bg-red-600 text-white font-poppins font-medium flex gap-2 py-2 px-3 items-center">
                <span>Link</span>
                <span><YouTube /></span>
                <span>Account</span>
            </button>
        )}
    </div>
  )
}

export default AccountLinkButtons