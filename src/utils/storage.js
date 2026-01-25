// Save transaction to localStorage
export const saveTransaction = (transaction) => {
  const transactions = getTransactions();
  transactions.push({
    ...transaction,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem('pos_transactions', JSON.stringify(transactions));
};

// Get all transactions
export const getTransactions = () => {
  const stored = localStorage.getItem('pos_transactions');
  return stored ? JSON.parse(stored) : [];
};

// Get transactions for a specific date range
export const getTransactionsByDateRange = (startDate, endDate) => {
  const transactions = getTransactions();
  return transactions.filter(t => {
    const date = new Date(t.timestamp);
    return date >= startDate && date <= endDate;
  });
};

// Get today's transactions
export const getTodayTransactions = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return getTransactionsByDateRange(today, tomorrow);
};

// Calculate daily sales
export const getDailySales = () => {
  const transactions = getTodayTransactions();
  return transactions.reduce((sum, t) => sum + t.total, 0);
};

// Get transaction count
export const getTransactionCount = (transactions) => {
  return transactions.length;
};

// Get menu from localStorage (with fallback to default)
export const getMenu = (defaultMenu) => {
  const stored = localStorage.getItem('pos_menu');
  return stored ? JSON.parse(stored) : defaultMenu;
};

// Save menu to localStorage
export const saveMenu = (menu) => {
  localStorage.setItem('pos_menu', JSON.stringify(menu));
};

// Clear all data (for reset)
export const clearAllData = () => {
  if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    localStorage.removeItem('pos_transactions');
    localStorage.removeItem('pos_menu');
    window.location.reload();
  }
};

// Export data as JSON
export const exportData = () => {
  const data = {
    transactions: getTransactions(),
    menu: JSON.parse(localStorage.getItem('pos_menu') || '{}'),
    exportDate: new Date().toISOString(),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pos-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};