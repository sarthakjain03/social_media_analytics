"use client";
import {
  TextField,
  Typography,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import { MUITextFieldSx } from "@/styles/muiCustomStyles";
import {
  handleResetLinkValidation,
  handleResetPassword,
} from "@/actions/authActions";
import { resetPasswordValidation } from "@/utils/validations";
import { useSearchParams, useRouter } from "next/navigation";

const ResetPasswordPage = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resetStatus, setResetStatus] = useState("");
  const [resetToken, setResetToken] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get("token");
      if (token) {
        const isValid = await handleResetLinkValidation(token);
        if (isValid) {
          setResetToken(token);
        } else {
          router.replace("/");
        }
      }
    };

    validateToken();
  }, [searchParams]);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordValidation,
    onSubmit: async (values) => {
      setSubmitting(true);

      const status = await handleResetPassword(resetToken, values.password);
      setResetStatus(status?.message ?? "");
      if (status?.success) {
        router.replace("/");
      }

      setSubmitting(false);
    },
  });

  return (
    <div className="flex justify-center items-center">
      <Stack spacing={3}>
        <Stack width={1} alignItems={"center"} spacing={1.5}>
          <Typography
            fontFamily={"poppins"}
            fontSize={20}
            fontWeight={500}
            color="textSecondary"
            textAlign={"center"}
          >
            Reset Your Account Password
          </Typography>
        </Stack>
        {resetStatus !== "" ? (
          <Typography
            fontFamily={"poppins"}
            fontSize={24}
            fontWeight={500}
            textAlign={"center"}
          >
            {resetStatus}
          </Typography>
        ) : (
          <Stack spacing={2.5}>
            <TextField
              name="password"
              label="New Password"
              type={viewPassword ? "text" : "password"}
              placeholder="Enter your new Password"
              sx={MUITextFieldSx}
              disabled={submitting}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={"Password must be at least 8 characters long"}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      onClick={() => setViewPassword((prev) => !prev)}
                      sx={{ paddingRight: "12px", color: "gray" }}
                    >
                      {viewPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  ),
                },
              }}
            />
            <TextField
              name="confirmPassword"
              label="Confirm New Password"
              type={viewConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new Password"
              sx={MUITextFieldSx}
              disabled={submitting}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      onClick={() => setViewConfirmPassword((prev) => !prev)}
                      sx={{ paddingRight: "12px", color: "gray" }}
                    >
                      {viewConfirmPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  ),
                },
              }}
            />
            {submitting ? (
              <div className="flex justify-center items-center w-full">
                <CircularProgress color="secondary" />
              </div>
            ) : (
              <button
                disabled={submitting}
                onClick={formik.submitForm}
                className="font-poppins text-lg font-medium text-white bg-purple-700 py-3 rounded-lg hover:bg-purple-800"
              >
                Reset Password
              </button>
            )}
          </Stack>
        )}
      </Stack>
    </div>
  );
};

export default ResetPasswordPage;
