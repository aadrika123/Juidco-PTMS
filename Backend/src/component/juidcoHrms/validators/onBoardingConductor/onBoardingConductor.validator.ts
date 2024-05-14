import * as Yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const OnBoardingConductorDataValidationSchema = Yup.object({
  firstName: Yup.string().required(),
  middleName: Yup.string().required(),
  lastName: Yup.string().required(),
  age: Yup.string().required(),
  bloodGrp: Yup.string().required(),

  mobileNo: Yup.string()
    .required("required")
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "mobile number must be 10 digit")
    .max(10, "mobile number must be 10 digit"),

  emailId: Yup.string().email("Please enter a valid email address"),

  emergencyMobNo: Yup.string()
    .required("required")
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "mobile number must be 10 digit")
    .max(10, "mobile number must be 10 digit"),

  adhar_no: Yup.string()
    .required("required")
    .min(12, "adhar no must be 12 digits")
    .max(12, "adhar no must be 12 digits"),
});
