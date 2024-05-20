import * as Yup from "yup";

export const OnBoardingBusDataValidationSchema = Yup.object({
  registration_no: Yup.string().required(),
  vin_no: Yup.string().required(),
});
