import { SETTINGS } from '../data/menuItems';

export const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const calculateTax = (subtotal) => {
  return subtotal * SETTINGS.taxRate;
};

export const calculateTotal = (items) => {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  return subtotal + tax;
};

export const formatCurrency = (amount) => {
  return `${SETTINGS.currency}${amount.toFixed(2)}`;
};

export const calculateChange = (total, amountPaid) => {
  return amountPaid - total;
};