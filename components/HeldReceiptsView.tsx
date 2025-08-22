import React from 'react';
import { HeldReceipt } from '../types';
import { motion } from 'framer-motion';

interface HeldReceiptsViewProps {
    heldReceipts: HeldReceipt[];
    onRecallReceipt: (receipt: HeldReceipt) => void;
    onDeleteReceiptRequest: (receipt: HeldReceipt) => void;
}

const HeldReceiptsView: React.FC<HeldReceiptsViewProps> = ({ heldReceipts, onRecallReceipt, onDeleteReceiptRequest }) => {

    const calculateTotal = (items: HeldReceipt['items']) => {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Held Receipts</h1>

            {heldReceipts.length === 0 ? (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <p>There are no held receipts.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {heldReceipts.map(receipt => (
                        <motion.div
                            key={receipt.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-800 rounded-lg shadow-md flex flex-col"
                        >
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">{receipt.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Held by {receipt.cashierName} at {new Date(receipt.heldAt).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="p-4 flex-grow">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-300">Items</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{receipt.items.reduce((acc, i) => acc + i.quantity, 0)}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-slate-600 dark:text-slate-300">Total</span>
                                    <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">Ksh {calculateTotal(receipt.items).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-700/50 flex justify-end gap-2 rounded-b-lg">
                                <button
                                    onClick={() => onDeleteReceiptRequest(receipt)}
                                    className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-md"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => onRecallReceipt(receipt)}
                                    className="px-3 py-1 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                                >
                                    Recall
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeldReceiptsView;
