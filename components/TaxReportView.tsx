import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sale, SupplierInvoice, Settings } from '../types';

interface TaxReportViewProps {
    sales: Sale[];
    supplierInvoices: SupplierInvoice[];
    settings: Settings;
}

type Tab = 'SalesVAT' | 'InputVAT';

const StatCard = ({ title, value, colorClass }: { title: string, value: string, colorClass: string }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
);

const aggregateDataByMonth = (items: any[], dateField: string, valueFields: { key: string, label: string }[]) => {
    const monthlyData: { [key: string]: { month: string, [key: string]: any } } = {};

    items.forEach(item => {
        const date = new Date(item[dateField]);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { 
                month: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
            };
            valueFields.forEach(field => monthlyData[monthKey][field.key] = 0);
        }

        valueFields.forEach(field => {
            // Special handling for taxable amount which is derived, not a direct field on sales
            if (field.key === 'taxableAmount') {
                 monthlyData[monthKey][field.key] += (item.subtotal - item.discountAmount);
            } else {
                monthlyData[monthKey][field.key] += item[field.key];
            }
        });
    });

    return Object.values(monthlyData).sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
};

const exportToCSV = (data: any[], headers: { key: string, label: string }[], filename: string) => {
    const csvRows = [
        headers.map(h => h.label).join(','), // header row
        ...data.map(row => 
            headers.map(header => {
                const value = row[header.key];
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            }).join(',')
        )
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const TaxReportView = ({ sales, supplierInvoices, settings }: TaxReportViewProps) => {
    const [activeTab, setActiveTab] = useState<Tab>('SalesVAT');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const filteredSales = useMemo(() => {
        const start = dateFrom ? new Date(dateFrom) : null;
        if(start) start.setHours(0,0,0,0);
        
        const end = dateTo ? new Date(dateTo) : null;
        if(end) end.setHours(23,59,59,999);
        
        return sales.filter(sale => {
            const saleDate = new Date(sale.date);
            if (start && saleDate < start) return false;
            if (end && saleDate > end) return false;
            return true;
        });
    }, [sales, dateFrom, dateTo]);

    const filteredInvoices = useMemo(() => {
        const start = dateFrom ? new Date(dateFrom) : null;
        if(start) start.setHours(0,0,0,0);
        
        const end = dateTo ? new Date(dateTo) : null;
        if(end) end.setHours(23,59,59,999);

        return supplierInvoices.filter(invoice => {
            const invoiceDate = new Date(invoice.invoiceDate);
            if (start && invoiceDate < start) return false;
            if (end && invoiceDate > end) return false;
            return true;
        });
    }, [supplierInvoices, dateFrom, dateTo]);


    const salesVatHeaders = [
        { key: 'month', label: 'Month' },
        { key: 'taxableAmount', label: `Taxable Sales (Ksh)` },
        { key: 'tax', label: `VAT Payable (${settings.tax.vatRate}%) (Ksh)` },
        { key: 'total', label: 'Gross Sales (Ksh)' },
    ];
    
    const inputVatHeaders = [
        { key: 'month', label: 'Month' },
        { key: 'subtotal', label: 'Net Purchases (Ksh)' },
        { key: 'taxAmount', label: `VAT Input (${settings.tax.vatRate}%) (Ksh)` },
        { key: 'totalAmount', label: 'Gross Purchases (Ksh)' },
    ];

    const salesVatData = useMemo(() => aggregateDataByMonth(filteredSales, 'date', [
        { key: 'taxableAmount', label: '' },
        { key: 'tax', label: '' },
        { key: 'total', label: '' }
    ]), [filteredSales]);

    const inputVatData = useMemo(() => aggregateDataByMonth(filteredInvoices, 'invoiceDate', [
        { key: 'subtotal', label: '' },
        { key: 'taxAmount', label: '' },
        { key: 'totalAmount', label: '' }
    ]), [filteredInvoices]);
    
    const formatCurrency = (amount: number) => amount.toFixed(2);

    const summary = useMemo(() => {
        const totalSalesVat = filteredSales.reduce((acc, sale) => acc + sale.tax, 0);
        const totalInputVat = filteredInvoices.reduce((acc, inv) => acc + inv.taxAmount, 0);
        const netVatPosition = totalSalesVat - totalInputVat;
        return { totalSalesVat, totalInputVat, netVatPosition };
    }, [filteredSales, filteredInvoices]);
    
    const TabButton = ({ tab, label }: { tab: Tab, label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold rounded-t-md relative transition-colors ${
                activeTab === tab 
                ? 'text-emerald-600' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
        >
            {label}
            {activeTab === tab && (
                <motion.div layoutId="tax-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
            )}
        </button>
    );

    const renderTable = (headers: {key:string, label:string}[], data: any[], exportFilename: string) => (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
             <div className="p-4 flex justify-end">
                <button 
                    onClick={() => exportToCSV(data, headers, exportFilename)}
                    className="bg-slate-700 text-white font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-md flex items-center text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export to CSV
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50 font-bold">
                        <tr>
                            {headers.map(h => <th key={h.key} scope="col" className="px-6 py-3">{h.label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map(row => (
                                <tr key={row.month} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700">
                                    {headers.map(h => (
                                        <td key={h.key} className={`px-6 py-4 ${h.key !== 'month' ? 'font-mono' : 'font-bold text-slate-900 dark:text-slate-100'}`}>
                                            {typeof row[h.key] === 'number' ? formatCurrency(row[h.key]) : row[h.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headers.length} className="text-center py-10 text-slate-500 dark:text-slate-400">
                                    No data available for the selected period.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Tax Reports</h1>

             <div className="my-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dateFrom" className="text-sm font-medium text-slate-600 dark:text-slate-400">From</label>
                    <input type="date" id="dateFrom" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full mt-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200" />
                </div>
                 <div>
                    <label htmlFor="dateTo" className="text-sm font-medium text-slate-600 dark:text-slate-400">To</label>
                    <input type="date" id="dateTo" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full mt-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total VAT Payable (Output)" value={`Ksh ${summary.totalSalesVat.toFixed(2)}`} colorClass="text-red-600 dark:text-red-400" />
                <StatCard title="Total VAT Claimable (Input)" value={`Ksh ${summary.totalInputVat.toFixed(2)}`} colorClass="text-green-600 dark:text-green-400" />
                <StatCard title="Net VAT Position" value={`Ksh ${summary.netVatPosition.toFixed(2)}`} colorClass={summary.netVatPosition >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'} />
            </div>
            <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-700">
                <TabButton tab="SalesVAT" label="VAT on Sales (Payable)" />
                <TabButton tab="InputVAT" label="VAT on Purchases (Input)" />
            </div>
            <div>
                {activeTab === 'SalesVAT' && renderTable(salesVatHeaders, salesVatData, 'vat-on-sales.csv')}
                {activeTab === 'InputVAT' && renderTable(inputVatHeaders, inputVatData, 'vat-input.csv')}
            </div>
        </div>
    );
};

export default TaxReportView;