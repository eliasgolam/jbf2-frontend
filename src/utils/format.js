

export const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0 CHF';
    return Number(value).toLocaleString('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  
  export const formatNumber = (value) => {
    return Number(value).toLocaleString('de-CH');
  };
  