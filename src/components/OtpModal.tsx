import {
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import { otpValidation } from "@/utils/validations";
import { MUITextFieldSx } from "@/styles/muiCustomStyles";
import { useState, useEffect } from "react";
import { verifyOTP, userSignUp } from "@/actions/authActions";

type OtpModalProps = {
  open: boolean;
  onClose: () => void;
  name: string;
  email: string;
  password: string;
  onSignUpSuccess: () => void;
};

const OtpModal = ({
  open,
  onClose,
  name,
  email,
  password,
  onSignUpSuccess,
}: OtpModalProps) => {
  const otpExpirationTime = 30 * 60 + 3; // OTP is valid for 30 minutes
  const [timeLeft, setTimeLeft] = useState(otpExpirationTime);
  const [timerIsRunning, setTimerIsRunning] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setTimeLeft(otpExpirationTime);
    setTimerIsRunning(false);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (timerIsRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      resetTimer();
    }

    return () => clearInterval(timer);
  }, [timerIsRunning, timeLeft]);

  const resendOTP = async () => {
    await userSignUp(email);

    setTimerIsRunning(true);
  };

  const formik = useFormik({
    initialValues: {
      attemptedOtp: "",
    },
    validationSchema: otpValidation,
    onSubmit: async (values) => {
      setSubmitting(true);
      await verifyOTP(
        name,
        email,
        Number(values.attemptedOtp),
        password,
        onSignUpSuccess
      );

      setSubmitting(false);
    },
  });

  return (
    <Dialog
      open={open}
      //onClose={() => {}}
      PaperProps={{
        style: {
          width: 350,
          borderRadius: 15,
          background: "linear-gradient(180deg, #d7f3fe 0%, #f3eaff 100%)",
        },
      }}
      scroll="body"
    >
      <DialogContent>
        <Stack spacing={3}>
          <Typography
            fontFamily={"poppins"}
            fontSize={22}
            fontWeight={500}
            textAlign={"center"}
          >
            OTP Verification
          </Typography>
          {submitting ? (
            <div className="flex justify-center items-center w-full">
              <CircularProgress color="secondary" />
            </div>
          ) : (
            <Stack spacing={2.5}>
              <Stack>
                <TextField
                  name="attemptedOtp"
                  label="OTP"
                  placeholder="Enter your OTP"
                  sx={MUITextFieldSx}
                  value={formik.values.attemptedOtp}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.attemptedOtp &&
                    Boolean(formik.errors.attemptedOtp)
                  }
                  helperText={
                    formik.touched.attemptedOtp && formik.errors.attemptedOtp
                  }
                />
                {timerIsRunning ? (
                  <Typography variant="body2" color="textSecondary">
                    {`You can resend another OTP in ${formatTime(timeLeft)}`}
                  </Typography>
                ) : (
                  <p
                    onClick={resendOTP}
                    className="cursor-pointer max-w-fit font-poppins text-sm text-gray-600 hover:text-gray-700"
                  >
                    Resend OTP
                  </p>
                )}
              </Stack>
              <button
                disabled={submitting}
                onClick={formik.submitForm}
                className="font-poppins text-lg font-medium text-white bg-purple-700 py-3 rounded-lg hover:bg-purple-800"
              >
                Sign Up
              </button>
              <div className="flex justify-center">
                <p
                  onClick={() => {
                    if (!submitting) onClose();
                  }}
                  className="cursor-pointer font-poppins text-lg font-medium text-purple-700 hover:text-purple-800 max-w-fit"
                >
                  Cancel
                </p>
              </div>
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default OtpModal;
