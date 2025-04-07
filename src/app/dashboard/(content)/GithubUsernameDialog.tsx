"use client";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import showToast from "@/utils/toast";

const GithubUsernameDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [githubUsername, setGithubUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConnectClick = async () => {
    setSubmitting(true);
    if (typeof window !== "undefined") {
      if (githubUsername) {
        try {
          const response = await fetch("/api/github/link-account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ githubUsername }),
          });

          const result = await response.json();
          if (result.success) {
            showToast("success", "GitHub account linked successfully!");
            onClose();
            window.location.reload();
          } else {
            showToast("error", "Failed to link GitHub account.");
          }
        } catch (error) {
          showToast("error", "An error occurred while linking your GitHub account.");
        }
      }
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { width: '450px' } }}>
      <DialogTitle>Connect your Github account</DialogTitle>
      <DialogContent>
        <TextField
          label="GitHub Username"
          placeholder="Enter your github username here"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          fullWidth
          sx={{ marginTop: '12px' }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          disabled={submitting || githubUsername?.length < 2}
          onClick={handleConnectClick}
        >
          Connect
        </Button>
        <Button
          color="error"
          variant="outlined"
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GithubUsernameDialog;
