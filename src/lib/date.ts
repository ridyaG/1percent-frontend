export function getDaysLeft(endDate: string | Date) {
  return Math.max(
    0,
    Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000)
  );
}