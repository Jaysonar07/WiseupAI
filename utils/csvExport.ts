import { Transaction } from '../types';

/**
 * Escapes a string field for standard RFC 4180 CSV compliance
 */
function escapeCSVField(field: string | number | undefined | null): string {
  if (field === undefined || field === null) return '""';
  const stringVal = String(field);
  if (stringVal.includes('"') || stringVal.includes(',') || stringVal.includes('\n') || stringVal.includes('\r')) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return `"${stringVal}"`;
}

/**
 * Converts transaction list to a formatted CSV string and triggers browser download
 */
export function exportTransactionsToCSV(transactions: Transaction[], userName: string = 'User'): { success: boolean; count: number; filename: string } {
  if (!transactions || transactions.length === 0) {
    // Generate empty template with headers
    const emptyHeaders = ['Transaction ID', 'Date', 'Time (IST/Local)', 'Merchant', 'Category', 'Classification', 'Amount (INR)', 'Currency'];
    const csvContent = emptyHeaders.join(',') + '\n';
    downloadBlob(csvContent, `WiseupAI_Transactions_Empty_${getFormattedDateString()}.csv`);
    return { success: true, count: 0, filename: `WiseupAI_Transactions_Empty_${getFormattedDateString()}.csv` };
  }

  // Headers
  const headers = [
    'Transaction ID',
    'Date',
    'Time',
    'Merchant',
    'Category',
    'Classification',
    'Entry Method',
    'Amount (INR)',
    'Currency'
  ];

  // Rows sorted by date descending (newest first)
  const sortedTxs = [...transactions].sort((a, b) => {
    const timeA = new Date(a.date).getTime() || 0;
    const timeB = new Date(b.date).getTime() || 0;
    return timeB - timeA;
  });

  const rows = sortedTxs.map(tx => {
    const d = tx.date ? new Date(tx.date) : new Date();
    const dateFormatted = !isNaN(d.getTime()) ? d.toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'N/A';
    const timeFormatted = !isNaN(d.getTime()) ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : 'N/A';
    const entryMethod = (tx.source === 'scan' || tx.imageUrl || tx.entryMethod === 'scanned_bill') ? 'Scanned Bill (AI Scan)' : 'Manual Entry';

    return [
      escapeCSVField(tx.id),
      escapeCSVField(dateFormatted),
      escapeCSVField(timeFormatted),
      escapeCSVField(tx.merchant || 'General Expense'),
      escapeCSVField(tx.category || 'Uncategorized'),
      escapeCSVField(tx.type === 'Impulsive' ? 'Impulsive (लापरवाह)' : 'Wise (समझदारी)'),
      escapeCSVField(entryMethod),
      escapeCSVField(Number(tx.amount) || 0),
      escapeCSVField('INR')
    ].join(',');
  });

  // Calculate summary metadata rows at bottom
  const totalAmount = sortedTxs.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const wiseAmount = sortedTxs.filter(t => t.type === 'Wise').reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const impulsiveAmount = sortedTxs.filter(t => t.type === 'Impulsive').reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const scannedAmount = sortedTxs.filter(t => t.source === 'scan' || t.imageUrl || t.entryMethod === 'scanned_bill').reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const manualAmount = totalAmount - scannedAmount;

  const summaryRows = [
    '',
    '--- SUMMARY METRICS ---',
    `"Total Transactions",${sortedTxs.length}`,
    `"Total Spend (INR)",${totalAmount}`,
    `"Wise Spending (INR)",${wiseAmount}`,
    `"Impulsive Spending (INR)",${impulsiveAmount}`,
    `"Scanned Bills Spend (INR)",${scannedAmount}`,
    `"Manual Entry Spend (INR)",${manualAmount}`,
    `"Exported For",${escapeCSVField(userName)}`,
    `"Export Date",${escapeCSVField(new Date().toLocaleString('en-IN'))}`
  ];

  const csvString = [headers.join(','), ...rows, ...summaryRows].join('\r\n');
  const filename = `WiseupAI_Transactions_${getFormattedDateString()}.csv`;

  downloadBlob(csvString, filename);
  return { success: true, count: sortedTxs.length, filename };
}

function getFormattedDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function downloadBlob(content: string, filename: string) {
  // Add UTF-8 BOM so Excel opens Hindi/special characters correctly
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
