export const formatINR = (value = 0) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const capitalize = (value = '') => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
};
