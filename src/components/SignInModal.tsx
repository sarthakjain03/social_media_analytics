import {
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Stack,
  Button,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { ChartNoAxesCombined, Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import { signInValidation, signUpValidation } from "@/utils/validations";
import Image from "next/image";
import { MUITextFieldSx } from "@/styles/muiCustomStyles";
import OtpModal from "./OtpModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { signUpOtp } from "@/actions/authActions";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import showToast from "@/utils/toast";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const SignInModal = ({ open, onClose }: ModalProps) => {
  const [formType, setFormType] = useState("signin");
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);

  const router = useRouter();

  const switchToSignInForm = () => {
    setFormType("signin");
  };

  const switchToSignUpForm = () => {
    setFormType("signup");
  };

  const credentialsSignIn = async (email: string, password: string) => {
    const results = await signIn("credentials", {
      redirect: false,
      identifier: email,
      password: password,
    });

    if (results?.error) {
      showToast("error", "Incorrect Email or Password");
    }

    if (results?.url) {
      router.replace("/dashboard");
      onClose();
    }
  };

  const googleSignIn = async () => {
    const results = await signIn("google");

    if (results?.error) {
      showToast("error", "Error occurred while signing in with Google");
    }
  };

  const onSignUpSuccess = async () => {
    await credentialsSignIn(formik.values.email, formik.values.password);
    setOpenOtpModal(false);
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema:
      formType === "signin" ? signInValidation : signUpValidation,
    onSubmit: async (values) => {
      setSubmitting(true);

      if (formType === "signup") {
        await signUpOtp(values.email, setOpenOtpModal);
      } else {
        await credentialsSignIn(values.email, values.password);
      }

      setSubmitting(false);
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          formik.resetForm();
          onClose();
        }}
        PaperProps={{
          style: {
            width: 400,
            borderRadius: 15,
            background: "linear-gradient(180deg, #d7f3fe 0%, #f3eaff 100%)",
          },
        }}
        scroll="body"
      >
        <DialogContent sx={{ paddingX: "2rem" }}>
          <Stack spacing={3}>
            <Stack width={1} alignItems={"center"} spacing={1.5}>
              <div className="flex items-center space-x-3">
                <ChartNoAxesCombined className="size-7 text-purple-600" />
                <span className="text-2xl font-bold text-gray-800 font-poppins">
                  Socialytics
                </span>
              </div>
              <Typography
                fontFamily={"poppins"}
                fontSize={20}
                fontWeight={500}
                color="textSecondary"
                textAlign={"center"}
              >
                {formType === "signin"
                  ? "Sign In to your Account"
                  : "Create a Socialytics Account"}
              </Typography>
            </Stack>
            <Stack spacing={2.5}>
              {formType === "signup" && (
                <TextField
                  name="name"
                  label="Name"
                  placeholder="Enter your Name"
                  sx={MUITextFieldSx}
                  disabled={submitting}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              )}
              <TextField
                name="email"
                label="Email"
                placeholder="Enter your Email"
                sx={MUITextFieldSx}
                disabled={submitting}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                name="password"
                label="Password"
                type={viewPassword ? "text" : "password"}
                placeholder="Enter your Password"
                sx={MUITextFieldSx}
                disabled={submitting}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={
                  formType === "signin"
                    ? formik.touched.password && formik.errors.password
                    : "Password must be at least 8 characters long"
                }
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
              {formType === "signup" && (
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type={viewConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your Password"
                  sx={MUITextFieldSx}
                  disabled={submitting}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <IconButton
                          onClick={() =>
                            setViewConfirmPassword((prev) => !prev)
                          }
                          sx={{ paddingRight: "12px", color: "gray" }}
                        >
                          {viewConfirmPassword ? <EyeOff /> : <Eye />}
                        </IconButton>
                      ),
                    },
                  }}
                />
              )}
              {submitting ? (
                <div className="flex justify-center items-center w-full">
                  <CircularProgress color="secondary" />
                </div>
              ) : (
                <>
                  {formType === "signin" ? (
                    <Stack spacing={1}>
                      <button
                        disabled={submitting}
                        onClick={formik.submitForm}
                        className="font-poppins text-lg font-medium text-white bg-purple-700 py-3 rounded-lg hover:bg-purple-800"
                      >
                        Sign In
                      </button>
                      <div className="flex justify-center">
                        <p
                          onClick={() => setOpenForgotPasswordModal(true)}
                          className="font-poppins text-gray-600 hover:text-gray-700 cursor-pointer max-w-fit"
                        >
                          Forgot Password
                        </p>
                      </div>
                    </Stack>
                  ) : (
                    <button
                      disabled={submitting}
                      onClick={formik.submitForm}
                      className="font-poppins text-lg font-medium text-white bg-purple-700 py-3 rounded-lg hover:bg-purple-800"
                    >
                      Sign Up
                    </button>
                  )}
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
                  <Divider>
                    <Typography color="textDisabled" variant="body2">
                      {formType === "signin"
                        ? "or sign in with"
                        : "or sign up with"}
                    </Typography>
                  </Divider>
                  <button
                    onClick={googleSignIn}
                    className="border border-purple-700 flex justify-center items-center space-x-2 py-2 rounded-lg hover:bg-purple-100"
                  >
                    <Image
                      src={"/Google.svg"}
                      width={20}
                      height={20}
                      alt="Google icon"
                    />
                    <p className="font-poppins font-medium text-lg text-gray-600">
                      Google
                    </p>
                  </button>
                  {formType === "signin" ? (
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      width={1}
                      justifyContent={"center"}
                    >
                      <Typography>Don&apos;t have an account?</Typography>
                      <Button
                        variant="text"
                        size="small"
                        onClick={switchToSignUpForm}
                        disabled={submitting}
                      >
                        Sign Up
                      </Button>
                    </Stack>
                  ) : (
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      width={1}
                      justifyContent={"center"}
                    >
                      <Typography>Already have an account?</Typography>
                      <Button
                        variant="text"
                        size="small"
                        onClick={switchToSignInForm}
                        disabled={submitting}
                      >
                        Sign In
                      </Button>
                    </Stack>
                  )}
                </>
              )}
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
      {openOtpModal && (
        <OtpModal
          open={openOtpModal}
          onClose={() => setOpenOtpModal(false)}
          name={formik.values.name}
          email={formik.values.email}
          password={formik.values.password}
          onSignUpSuccess={onSignUpSuccess}
        />
      )}
      {openForgotPasswordModal && (
        <ForgotPasswordModal
          open={openForgotPasswordModal}
          onClose={() => setOpenForgotPasswordModal(false)}
        />
      )}
    </>
  );
};

export default SignInModal;
