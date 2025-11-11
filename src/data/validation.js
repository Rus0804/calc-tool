export function isPositiveNumber(value) {
  return value !== "" && !isNaN(value) && Number(value) >= 0;
}
