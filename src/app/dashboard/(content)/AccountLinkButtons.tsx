"use client"
import { X, Instagram, GitHub } from "@mui/icons-material";
import { useUserStore } from "@/store/user";
import { useState } from "react";
import GithubUsernameDialog from "./GithubUsernameDialog";

const AccountLinkButtons = () => {
    const { isInstagramConnected, isGithubConnected, isXConnected } = useUserStore();
    const [openUsernameDialog, setOpenUsernameDialog] = useState(false);

    const getXUrlAndRedirect = () => {
        if (typeof window !== "undefined") {
            window.location.href = "/api/twitter/get-auth-url";
        }
    };

    const instagramAuthRedirect = () => {
        if (typeof window !== "undefined") {
            window.location.href = "/api/instagram/get-auth-url";
        }
    };

    const handleLinkClickGithub = async () => {
        setOpenUsernameDialog(true);
    };

    if (isXConnected && isInstagramConnected && isGithubConnected) {
        return null;
    }

    return (
        <>
        <div className="flex gap-4 items-center justify-center flex-wrap mb-3">
            {!isXConnected && (
                <button onClick={getXUrlAndRedirect} className="rounded-lg bg-black text-white font-poppins font-medium flex gap-2 py-2 px-3 items-center">
                    <span>Link</span>
                    <span><X fontSize="small" /></span>
                    <span>Account</span>
                </button>
            )}
            {!isInstagramConnected && (
                <button onClick={instagramAuthRedirect} className="rounded-lg bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white font-poppins font-medium flex gap-2 py-2 px-3 items-center">
                    <span>Link</span>
                    <span><Instagram /></span>
                    <span>Account</span>
                </button>
            )}
            {!isGithubConnected && (
                <button onClick={handleLinkClickGithub} className="rounded-lg bg-black text-white font-poppins font-medium flex gap-2 py-2 px-3 items-center">
                    <span>Link</span>
                    <span><GitHub /></span>
                    <span>Account</span>
                </button>
            )}
        </div>
        {openUsernameDialog && (
            <GithubUsernameDialog open={openUsernameDialog} onClose={() => setOpenUsernameDialog(false)} />
        )}
        </>
    );
};

export default AccountLinkButtons;