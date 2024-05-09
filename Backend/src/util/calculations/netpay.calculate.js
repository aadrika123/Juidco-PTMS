export function calculate_net_pay(
  basic_pay,
  allowances,
  deductions,
  working_hour,
  no_of_leave_approved
) {
  const total_hours = 26 * 8;
  const gross_pay = basic_pay + allowances;
  const salary_per_hour = gross_pay / total_hours;
  const no_of_hours_leave_approved = no_of_leave_approved * 8;

  const calc_non_billable_hours =
    total_hours - working_hour + no_of_hours_leave_approved;

  const calc_non_billable_salary = salary_per_hour * calc_non_billable_hours;

  const net_pay = gross_pay - calc_non_billable_salary - deductions;

  return net_pay;
}
