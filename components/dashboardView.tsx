import React, { useMemo, useState, ReactNode } from 'react';
import { Sale, Product, Supplier, SupplierInvoice } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

interface DashboardViewProps {
    sales: Sale[];
    products: Product[];
    suppliers: Supplier[];
    supplierInvoices: SupplierInvoice[];
}

const StatCard = ({ title, value, children }: { title: string; value: string | number; children: ReactNode }) => (
    <motion.div 
        className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-md"
        whileHover={{ y: -3, scale: 1.02, boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.05)" }}
    >
        <div className="bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary p-3 rounded-lg w-fit mb-4">
            {children}
        </div>
        <div>
            <p className="text-sm text-foreground/70 dark:text-dark-foreground/70 font-semibold">{title}</p>
            <p className="text-2xl font-bold text-foreground dark:text-dark-foreground">{value}</p>
        </div>
    </motion.div>
);

const DashboardView = ({ sales, products, suppliers, supplierInvoices }: DashboardViewProps) => {
    
    const [theme] = useTheme();
    type DateRange = 'today' | '7d' | '30d' | 'all';
    const [dateRange, setDateRange] = useState<DateRange>('7d');

    const filteredSales = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (dateRange === 'all') {
            return sales;
        }

        let startDate = new Date();
        if (dateRange === 'today') {
            startDate = startOfToday;
        } else if (dateRange === '7d') {
            startDate = new Date(new Date().setDate(startOfToday.getDate() - 6));
        } else if (dateRange === '30d') {
             startDate = new Date(new Date().setDate(startOfToday.getDate() - 29));
        }
        startDate.setHours(0,0,0,0);
        
        return sales.filter(sale => new Date(sale.date) >= startDate);
    }, [sales, dateRange]);

    const totalRevenue = useMemo(() => {
        return filteredSales.reduce((acc, sale) => {
            const revenue = sale.depositApplied ? (sale.total + sale.depositApplied) : sale.total;
            return acc + revenue;
        }, 0);
    }, [filteredSales]);

    const totalTransactions = filteredSales.length;

    const salesChartData = useMemo(() => {
        const data: { [key: string]: number } = {};
        
        if (dateRange === 'all') {
            // Aggregate by month for all-time view
            filteredSales.forEach(sale => {
                const month = new Date(sale.date).toLocaleString('en-GB', { month: 'short', year: 'numeric', timeZone: 'Africa/Nairobi' });
                if (!data[month]) data[month] = 0;
                data[month] += sale.depositApplied ? (sale.total + sale.depositApplied) : sale.total;
            });
            return Object.keys(data)
                .map(month => ({ name: month, Sales: data[month] }))
                .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
        }

        // Aggregate by day for other ranges
        filteredSales.forEach(sale => {
            const day = new Date(sale.date).toLocaleDateString('en-CA', {timeZone: 'Africa/Nairobi'}); // YYYY-MM-DD
            if (!data[day]) data[day] = 0;
            data[day] += sale.depositApplied ? (sale.total + sale.depositApplied) : sale.total;
        });

        const result = [];
        const daysInRange = dateRange === 'today' ? 1 : dateRange === '7d' ? 7 : 30;
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        for (let i = daysInRange - 1; i >= 0; i--) {
            const date = new Date(startOfToday.getTime() - i * 24 * 60 * 60 * 1000);
            const dayKey = date.toLocaleDateString('en-CA', {timeZone: 'Africa/Nairobi'});
            const name = date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', timeZone: 'Africa/Nairobi' });
            result.push({ name, Sales: data[dayKey] || 0 });
        }
        
        return result;

    }, [filteredSales, dateRange]);


    const topSellingProducts = useMemo(() => {
        const productSales: { [key: string]: { name: string; value: number } } = {};
        filteredSales.forEach(sale => {
            sale.items.forEach(item => {
                if (!productSales[item.id]) {
                    productSales[item.id] = { name: item.name, value: 0 };
                }
                productSales[item.id].value += item.quantity;
            });
        });
        return Object.values(productSales)
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [filteredSales]);

    const apSummary = useMemo(() => {
        const unpaidInvoices = supplierInvoices.filter(inv => inv.status !== 'Paid');
        const totalDue = unpaidInvoices.reduce((acc, inv) => acc + (inv.totalAmount - inv.paidAmount), 0);
        const urgentInvoices = unpaidInvoices
            .map(inv => ({...inv, dueDate: new Date(inv.dueDate)}))
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
            .slice(0, 5);
        return { totalDue, urgentInvoices };
    }, [supplierInvoices]);

    const supplierMap = useMemo(() => new Map(suppliers.map(s => [s.id, s.name])), [suppliers]);
    
    const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
    
    const DateButton = ({ label, range, activeRange, onClick }: { label: string; range: DateRange; activeRange: DateRange; onClick: (range: DateRange) => void }) => (
        <button
            onClick={() => onClick(range)}
            className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors ${
                activeRange === range ? 'bg-card dark:bg-dark-card text-primary dark:text-dark-primary-content shadow-sm' : 'text-foreground/60 dark:text-dark-foreground/60 hover:text-foreground dark:hover:text-dark-foreground'
            }`}
        >
            {label}
        </button>
    );
    
    const chartTitles: Record<DateRange, string> = {
        today: "Today's Sales",
        '7d': 'Sales Trend (Last 7 Days)',
        '30d': 'Sales Trend (Last 30 Days)',
        all: 'Sales Trend (All Time)'
    };

    const tooltipLabelStyle = { color: theme === 'dark' ? '#cbd5e1' : '#334155' };
    const chartTickColor = theme === 'dark' ? '#94a3b8' : '#64748b';

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground">Dashboard</h1>
                <div className="flex bg-background/50 dark:bg-dark-card/50 p-1 rounded-lg border dark:border-dark-border">
                    <DateButton label="Today" range="today" activeRange={dateRange} onClick={setDateRange} />
                    <DateButton label="7 Days" range="7d" activeRange={dateRange} onClick={setDateRange} />
                    <DateButton label="30 Days" range="30d" activeRange={dateRange} onClick={setDateRange} />
                    <DateButton label="All Time" range="all" activeRange={dateRange} onClick={setDateRange} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`Ksh ${totalRevenue.toFixed(2)}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </StatCard>
                <StatCard title="Total Transactions" value={totalTransactions}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                </StatCard>
                 <StatCard title="Accounts Payable" value={`Ksh ${apSummary.totalDue.toFixed(2)}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </StatCard>
                <StatCard title="Products in Stock" value={products.length}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </StatCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-card dark:bg-dark-card p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground mb-4">{chartTitles[dateRange]}</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.2)" />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: chartTickColor }} />
                            <YAxis tick={{ fontSize: 12, fill: chartTickColor }} />
                            <Tooltip wrapperClassName="!bg-card dark:!bg-dark-card/80 dark:!backdrop-blur-sm !border-border dark:!border-dark-border !rounded-md !shadow-lg" contentStyle={{ backgroundColor: 'transparent', border: 'none' }} labelStyle={tooltipLabelStyle} itemStyle={{ color: '#10b981' }} />
                            <Legend wrapperStyle={{ color: chartTickColor }} />
                            <Bar dataKey="Sales" fill="#059669" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 grid grid-rows-2 gap-8">
                    <div className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground mb-4">Top 5 Selling Products</h2>
                        {topSellingProducts.length > 0 ? (
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie
                                        data={topSellingProducts}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {topSellingProducts.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value} units`, name]} wrapperClassName="!bg-card dark:!bg-dark-card !border-border dark:!border-dark-border !rounded-md" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                             <div className="h-full flex items-center justify-center text-foreground/60 dark:text-dark-foreground/60">No sales data for this period.</div>
                        )}
                    </div>
                     <div className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-md flex flex-col">
                        <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground mb-4">Urgent Payables</h2>
                        <div className="space-y-2 text-sm flex-grow overflow-y-auto">
                            {apSummary.urgentInvoices.map(inv => {
                                const isOverdue = inv.dueDate < new Date();
                                return (
                                    <div key={inv.id} className="flex justify-between items-center p-2 rounded-md hover:bg-background dark:hover:bg-dark-card/50">
                                        <div>
                                            <p className="font-bold text-foreground/80 dark:text-dark-foreground/80">{supplierMap.get(inv.supplierId) || 'Unknown'}</p>
                                            <p className={`text-xs ${isOverdue ? 'text-danger' : 'text-foreground/60 dark:text-dark-foreground/60'}`}>
                                                Due: {inv.dueDate.toLocaleDateString('en-GB', {timeZone: 'Africa/Nairobi'})}
                                            </p>
                                        </div>
                                        <p className="font-bold text-foreground dark:text-dark-foreground font-mono">Ksh {(inv.totalAmount - inv.paidAmount).toFixed(2)}</p>
                                    </div>
                                )
                            })}
                             {apSummary.urgentInvoices.length === 0 && (
                                <p className="text-foreground/60 dark:text-dark-foreground/60 text-center pt-4">No urgent payments due.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;