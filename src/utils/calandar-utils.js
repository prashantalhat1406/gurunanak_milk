export const getMonthMeta = (selectedMonth) => {
  const [year, month] = selectedMonth.split("-").map(Number);

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  return { year, month, firstDay, daysInMonth };
};

export const buildCalendarDays = (firstDay, daysInMonth) => {
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  while (calendarDays.length < 42) calendarDays.push(null);

  return calendarDays;
};

export const getDateString = (year, month, day) => {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};