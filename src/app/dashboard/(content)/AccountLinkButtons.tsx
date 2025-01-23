"use client"
import { X, Instagram, LinkedIn } from "@mui/icons-material";
import { useUserStore } from "@/store/user"

const AccountLinkButtons = () => {
    const { isInstagramConnected, isLinkedinConnected, isXConnected } = useUserStore();

    const getXUrlAndRedirect = () => {
        if (typeof window !== "undefined") {
            window.location.href = "/api/twitter/get-auth-url";
        }
    };

    // if (isXConnected && isLinkedinConnected && isInstagramConnected) {
    if (isXConnected) {
        return null;
    }

  return (
    <div className="flex gap-4 items-center justify-center flex-wrap my-3">
        {!isXConnected && (
            <button onClick={getXUrlAndRedirect} className="rounded-lg bg-black text-white font-poppins font-medium flex gap-2 py-2 px-3 items-center">
                <span>Link</span>
                <span><X fontSize="small" /></span>
                <span>Account</span>
            </button>
        )}
        {/* {!isLinkedinConnected && (
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
        )} */}
    </div>
  )
}

export default AccountLinkButtons