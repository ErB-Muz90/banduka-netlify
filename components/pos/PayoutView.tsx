import React, { useState } from 'react';
import { Shift } from '../../types';
import { motion } from 'framer-motion';

interface PayoutViewProps {
    activeShift: Shift | null;
    onProcessPayout: (amount: number, reason: string, payee?: string) => void;
    onBack: () => void;
}

const PayoutView: React.FC<PayoutViewProps> = ({ activeShift, onProcessPayout, onBack }) => {
    const [amount, setAmount] = useState<number | ''>('');
    const [reason, setReason] = useState('');
    const [payee, setPayee] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (typeof amount !== 'number' || amount <= 0) {
            setError('Please enter a valid positive amount.');
            return;
        }
        if (!reason.trim()) {
            setError('A reason for the payout is required.');
            return;
        }
        onProcessPayout(amount, reason, payee.trim() || undefined);
    };
    
    if (!activeShift) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-slate-700">Shift Not Active</h1>
                <p className="mt-2 text-slate-500">You must start a shift before you can record a payout.</p>
                <button onClick={onBack} className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg">Back to POS</button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-slate-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">Record a Payout</h1>
                    <button onClick={onBack} className="text-sm font-bold text-emerald-600 hover:text-emerald-800">&larr; Cancel</button>
                </div>
                <p className="text-slate-500 mb-6">Record cash removed from the drawer for expenses. This will be reflected in your end-of-shift report.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount (Ksh)</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={e => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                            min="0.01"
                            step="0.01"
                            required
                            autoFocus
                            className="mt-1 w-full px-4 py-2 rounded-lg border border-slate-300 text-xl font-bold"
                        />
                    </div>
                     <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Reason for Payout</label>
                        <input
                            type="text"
                            id="reason"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 rounded-lg border border-slate-300"
                            placeholder="e.g., Office supplies"
                        />
                    </div>
                     <div>
                        <label htmlFor="payee" className="block text-sm font-medium text-slate-700">Paid To (Optional)</label>
                        <input
                            type="text"
                            id="payee"
                            value={payee}
                            onChange={e => setPayee(e.target.value)}
                            className="mt-1 w-full px-4 py-2 rounded-lg border border-slate-300"
                            placeholder="e.g., Naivas Supermarket"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg text-lg hover:bg-accent">Record Payout</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default PayoutView;
