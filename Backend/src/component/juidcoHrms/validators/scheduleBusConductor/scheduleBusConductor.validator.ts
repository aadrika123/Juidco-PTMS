import * as Yup from "yup";

export const ScheduleBusConductorValidationSchema = Yup.object({
  bus_no: Yup.string().required(),
  conductor_id: Yup.string().required(),
  date: Yup.string().required(),
  time: Yup.string().required(),
});
