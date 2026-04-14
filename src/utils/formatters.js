// ============================================
// MOBUS PROPERTY — FORMATTERS
// ============================================

import { EXCHANGE_RATES } from './constants';

/**
 * Format currency amount with symbol
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount == null) return '—';
  
  const symbols = { USD: '$', GHS: 'GH₵', NGN: '₦' };
  const symbol = symbols[currency] || currency;
  
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  
  return `${symbol}${formatted}`;
}

/**
 * Convert amount to USD equivalent
 */
export function toUSD(amount, fromCurrency) {
  if (!amount) return 0;
  return amount / (EXCHANGE_RATES[fromCurrency] || 1);
}

/**
 * Convert USD amount to target currency
 */
export function fromUSD(amountUSD, toCurrency) {
  if (!amountUSD) return 0;
  return amountUSD * (EXCHANGE_RATES[toCurrency] || 1);
}

/**
 * Format date as "14 Apr 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format date as "Apr 2026"
 */
export function formatMonthYear(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format relative date ("2 days ago", "in 5 days")
 */
export function formatRelativeDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = d - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

/**
 * Format percentage
 */
export function formatPercent(value, decimals = 1) {
  if (value == null) return '—';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers compactly (e.g. 1.2M, 45K)
 */
export function formatCompact(value) {
  if (value == null) return '—';
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

/**
 * Get days until a date
 */
export function daysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

/**
 * Get aging bucket for overdue payments
 */
export function getAgingBucket(daysPastDue) {
  if (daysPastDue <= 30) return '0-30 days';
  if (daysPastDue <= 60) return '31-60 days';
  if (daysPastDue <= 90) return '61-90 days';
  return '90+ days';
}

/**
 * Generate a receipt reference
 */
export function generateReceiptRef(propertyCode, index) {
  const year = new Date().getFullYear();
  return `${propertyCode}-${year}-${String(index).padStart(4, '0')}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 40) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format status string to human-readable
 */
export function formatStatus(status) {
  if (!status) return '—';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
