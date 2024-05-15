import * as Yup from "yup";

export const ConductorReportValidationSchema = Yup.object({
  currentDate: Yup.date().required(),
  conductor_id: Yup.string().required(),
});

export const ConductorReportMonthlyValidationSchema = Yup.object({
  time: Yup.string().required(),
  conductor_id: Yup.string().required(),
});
