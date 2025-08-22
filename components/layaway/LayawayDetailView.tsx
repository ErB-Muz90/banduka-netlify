import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layaway, Payment } from '../../types';

interface LayawayDetailViewProps {
    layaway: Layaway;
    onBack: () => void;
    onAddPayment: (layawayId: string, amount: number, method: Payment['method']) => void;
}

const StatCard: React.FC<{ title: string; value: string; className?: string }> = ({ title, value, className }) => (
    <div className={`p-4 rounded-lg text-center ${className}`}>
        <p className="text-sm font-bold uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold font-mono">{value}</p>
    </div>
);

const LayawayDetailView: React.FC<LayawayDetailViewProps> = ({ layaway, onBack, onAddPayment }) => {
    const [paymentAmount, setPaymentAmount] = useState<number | ''>('');
    const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('Cash');

    const totalPaid = useMemo(() => {
        return layaway.payments.reduce((acc, p) => acc + p.amount, 0);
    }, [layaway.payments]);

    const handleAddPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof paymentAmount === 'number' && paymentAmount > 0 && paymentAmount <= layaway.balance) {
            onAddPayment(layaway.id, paymentAmount, paymentMethod);
            setPaymentAmount('');
        }
    };
    
    const formatCurrency = (amount: number) => `Ksh ${amount.toFixed(2)}`;

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-slate-100 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Layaway Details</h1>
                        <p className="font-mono text-slate-500 dark:text-slate-400">{layaway.id}</p>
                    </div>
                    <button onClick={onBack} className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800">&larr; Back to List</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                    <StatCard title="Total Value" value={formatCurrency(layaway.total)} className="bg-slate-600 dark:bg-slate-700" />
                    <StatCard title="Total Paid" value={formatCurrency(totalPaid)} className="bg-green-600 dark:bg-green-700" />
                    <StatCard title="Balance Due" value={formatCurrency(layaway.balance)} className="bg-red-600 dark:bg-red-700" />
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                     <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 border-b dark:border-slate-700 pb-2">Layaway Items</h2>
                     <ul className="divide-y dark:divide-slate-700">
                        {layaway.items.map(item => (
                            <li key={item.id} className="p-2 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.quantity} x {formatCurrency(item.price)}</p>
                                </div>
                                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(item.price * item.quantity)}</p>
                            </li>
                        ))}
                     </ul>
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                         <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Payment History</h2>
                         <ul className="divide-y dark:divide-slate-700 max-h-60 overflow-y-auto">
                             {layaway.payments.map((p, i) => (
                                <li key={i} className="py-2 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(p.amount)}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(p.date).toLocaleString()} via {p.method}</p>
                                    </div>
                                </li>
                            ))}
                         </ul>
                    </div>

                    {layaway.status === 'Active' && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Record New Payment</h2>
                            <form onSubmit={handleAddPayment} className="space-y-4">
                                <div>
                                    <label htmlFor="paymentAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount (Ksh)</label>
                                    <input
                                        type="number"
                                        id="paymentAmount"
                                        value={paymentAmount}
                                        onChange={e => setPaymentAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                        max={layaway.balance}
                                        min="0.01"
                                        step="0.01"
                                        required
                                        className="mt-1 block w-full p-2 border border-slate-300 rounded-md dark:bg-slate-700"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Method</label>
                                    <select id="paymentMethod" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as Payment['method'])} className="mt-1 block w-full p-2 border border-slate-300 rounded-md dark:bg-slate-700">
                                        <option>Cash</option>
                                        <option>M-Pesa</option>
                                        <option>Card</option>
                                    </select>
                                </div>
                                <motion.button type="submit" whileTap={{ scale: 0.95 }} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">
                                    Add Payment
                                </motion.button>
                            </form>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default LayawayDetailView;