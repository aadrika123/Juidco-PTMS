import * as Yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const OnBoardingConductorDataValidationSchema = Yup.object({
  firstName: Yup.string(),
  middleName: Yup.string(),
  lastName: Yup.string(),
  age: Yup.string(),
  bloodGrp: Yup.string(),

  mobileNo: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "mobile number must be 10 digit")
    .max(10, "mobile number must be 10 digit"),

  emailId: Yup.string().email("Please enter a valid email address"),

  emergencyMobNo: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "mobile number must be 10 digit")
    .max(10, "mobile number must be 10 digit"),

  adhar_no: Yup.string()
    .min(12, "adhar no must be 12 digits")
    .max(12, "adhar no must be 12 digits"),
});
