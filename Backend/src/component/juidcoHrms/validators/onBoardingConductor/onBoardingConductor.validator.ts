import * as Yup from "yup";

export const OnBoardingConductorDataValidationSchema = Yup.object({
  firstName: Yup.string().required(),
  middleName: Yup.string().required(),
  lastName: Yup.string().required(),
  age: Yup.string().required(),
  bloodGrp: Yup.string().required(),
  mobileNo: Yup.string().required(),
  emailId: Yup.string().required(),
  emergencyMobNo: Yup.string().required(),
});
