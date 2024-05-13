import * as Yup from "yup";

// export const OnBoardingBusDataValidator = (busData: BusDataType) => {

// }

export const OnBoardingBusDataValidationSchema = Yup.object({
  registration_no: Yup.string().required(),
  vin_no: Yup.string().required(),
  // pollution_cert: Yup.string().required(),
  // taxCopy_cert: Yup.string().required(),
  // registration_cert: Yup.string().required(),
});
