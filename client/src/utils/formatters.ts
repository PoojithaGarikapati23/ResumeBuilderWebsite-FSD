export const formatINR = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatINRWithDecimals = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusBadgeClass = (status: string): string => {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
    case 'ACTIVE':
    case 'DELIVERED':
    case 'PAID':
    case 'SETTLED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20';
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20';
    case 'CONFIRMED':
    case 'PROCESSING':
      return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20';
    case 'SHIPPED':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-600/20';
    case 'SUSPENDED':
    case 'REJECTED':
    case 'CANCELLED':
    case 'FAILED':
    case 'ARCHIVED':
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20';
    case 'DRAFT':
      return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-600/20';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-600/20';
  }
};
