import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { MUITextFieldSx } from "@/styles/muiCustomStyles";
import { handleForgotPassword } from "@/actions/authActions";

type ForgotModalProps = {
  open: boolean;
  onClose: () => void;
};

const ForgotPasswordModal = ({ open, onClose }: ForgotModalProps) => {
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Enter a valid email address")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      await handleForgotPassword(values.email, onClose);
      
      setSubmitting(false);
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: 370,
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
            Forgot Password
          </Typography>
          {submitting ? (
            <div className="flex justify-center items-center w-full">
              <CircularProgress color="secondary" />
            </div>
          ) : (
            <Stack spacing={2.5}>
              <TextField
                name="email"
                label="Email"
                placeholder="Enter your registered email address"
                sx={MUITextFieldSx}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <button
                disabled={submitting}
                onClick={formik.submitForm}
                className="font-poppins text-lg font-medium text-white bg-purple-700 py-3 rounded-lg hover:bg-purple-800"
              >
                Send Link
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

export default ForgotPasswordModal;
