export function getCurrentWeekRange() {
  const today = new Date();

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = today.getDay();

  // Calculate the difference to get back to Monday
  const diffToMonday = (dayOfWeek + 6) % 7; // If today is Sunday (0), then it will be 6 days back; otherwise, dayOfWeek - 1

  // Calculate the start of the week (Monday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0); // Set time to midnight

  // Calculate the end of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999); // Set time to the end of the day

  const formatDate = (date: any) => date.toISOString().slice(0, 10);

  return {
    startOfWeek: formatDate(startOfWeek),
    endOfWeek: formatDate(endOfWeek),
  };
}

export function getCurrentMonthRange() {
  const today = new Date();

  // Calculate the start of the month (1st day of the current month)
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0); // Set time to midnight

  // End of the range is the current date
  const endOfMonth = new Date(today);
  endOfMonth.setHours(23, 59, 59, 999); // Set time to the end of the current day

  const formatDate = (date: any) => date.toISOString().slice(0, 10);

  return {
    startOfMonth: formatDate(startOfMonth),
    endOfMonth: formatDate(endOfMonth),
  };
}