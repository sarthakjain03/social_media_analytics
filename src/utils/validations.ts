import * as yup from "yup";

export const signInValidation = yup.object({
  email: yup.string().email("Please enter a valid Email").required("Required"),
  password: yup
    .string()
    .min(8, "Password must at least 8 characters")
    .required("Required"),
});

export const signUpValidation = yup.object({
  name: yup
    .string()
    .min(2, "Name should contain at least 2 characters")
    .max(40, "Name should not exceed 40 characters")
    .required("Required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Required"),
  password: yup.string().min(8, "").required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Required"),
});
