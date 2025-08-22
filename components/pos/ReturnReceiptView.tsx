import React, { useState, useMemo } from 'react';
import { Sale, CartItem, Shift } from '../../types';
import { motion } from 'framer-motion';

interface ReturnReceiptViewProps {
    sales: Sale[];
    activeShift: Shift | null;
    onProcessReturn: (originalSale: Sale, returnedItems: CartItem[], reason: string, refundMethod: 'Cash' | 'Card' | 'M-Pesa') => void;
    onBack: () => void;
}

const ReturnReceiptView: React.FC<ReturnReceiptViewProps> = ({ sales, activeShift, onProcessReturn, onBack }) => {
    const [receiptId, setReceiptId] = useState('');
    const [foundSale, setFoundSale] = useState<Sale | null>(null);
    const [returnedQuantities, setReturnedQuantities] = useState<{ [key: string]: number }>({});
    const [returnReason, setReturnReason] = useState('');
    const [refundMethod, setRefundMethod] = useState<'Cash' | 'Card' | 'M-Pesa'>('Cash');
    const [error, setError] = useState('');

    const handleFindReceipt = () => {
        setError('');
        const sale = sales.find(s => s.id.toLowerCase() === receiptId.toLowerCase().trim() && s.type !== 'Return');
        if (sale) {
            setFoundSale(sale);
            const initialQuantities = sale.items.reduce((acc, item) => {
                acc[item.id] = 0;
                return acc;
            }, {} as { [key: string]: number });
            setReturnedQuantities(initialQuantities);
        } else {
            setError('Sale receipt not found or it is already a return.');
            setFoundSale(null);
        }
    };

    const handleQuantityChange = (itemId: string, originalQuantity: number, change: number) => {
        const currentReturnQty = returnedQuantities[itemId] || 0;
        const newReturnQty = Math.max(0, Math.min(originalQuantity, currentReturnQty + change));
        setReturnedQuantities(prev => ({ ...prev, [itemId]: newReturnQty }));
    };

    const returnedItemsForProcessing = useMemo((): CartItem[] => {
        if (!foundSale) return [];
        return foundSale.items
            .filter(item => returnedQuantities[item.id] > 0)
            .map(item => ({ ...item, quantity: returnedQuantities[item.id] }));
    }, [foundSale, returnedQuantities]);

    const refundTotal = useMemo(() => {
        return returnedItemsForProcessing.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [returnedItemsForProcessing]);

    const handleProcessReturn = () => {
        if (!foundSale) return;
        if (returnedItemsForProcessing.length === 0) {
            setError('Please select at least one item to return.');
            return;
        }
        if (!returnReason.trim()) {
            setError('A reason for the return is required.');
            return;
        }
        onProcessReturn(foundSale, returnedItemsForProcessing, returnReason, refundMethod);
    };

    if (!activeShift) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-slate-700">Shift Not Active</h1>
                <p className="mt-2 text-slate-500">You must start a shift before you can process a return.</p>
                <button onClick={onBack} className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg">Back to POS</button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">Process a Return</h1>
                    <button onClick={onBack} className="text-sm font-bold text-emerald-600 hover:text-emerald-800">&larr; Back to POS</button>
                </div>

                {!foundSale ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Find Original Receipt</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={receiptId}
                                onChange={e => setReceiptId(e.target.value)}
                                placeholder="Enter Receipt ID to find sale..."
                                className="flex-grow w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button onClick={handleFindReceipt} className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-emerald-700">Find</button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-bold">Original Sale: <span className="font-mono text-emerald-700">{foundSale.id}</span></h3>
                            <p className="text-sm text-slate-500">Date: {new Date(foundSale.date).toLocaleString()}</p>
                            <button onClick={() => setFoundSale(null)} className="text-sm text-blue-600 hover:underline mt-2">Find a different receipt</button>
                        </div>

                        <div className="bg-white rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold p-4 border-b">Select Items to Return</h3>
                            <div className="max-h-80 overflow-y-auto">
                                <ul className="divide-y">
                                    {foundSale.items.map(item => (
                                        <li key={item.id} className="p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold">{item.name}</p>
                                                <p className="text-sm text-slate-500">Purchased: {item.quantity} @ Ksh {item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)} className="w-8 h-8 rounded-full bg-slate-200 text-slate-800">-</button>
                                                <span className="font-bold w-8 text-center">{returnedQuantities[item.id] || 0}</span>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="w-8 h-8 rounded-full bg-slate-200 text-slate-800">+</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                             <div>
                                <label htmlFor="returnReason" className="block text-sm font-medium text-slate-700">Reason for Return</label>
                                <input
                                    type="text"
                                    id="returnReason"
                                    value={returnReason}
                                    onChange={e => setReturnReason(e.target.value)}
                                    className="mt-1 w-full px-4 py-2 rounded-lg border border-slate-300"
                                    placeholder="e.g., Damaged item"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Refund Method</label>
                                <div className="flex gap-4">
                                    {(['Cash', 'Card', 'M-Pesa'] as const).map(method => (
                                        <label key={method} className="flex items-center">
                                            <input type="radio" name="refundMethod" value={method} checked={refundMethod === method} onChange={() => setRefundMethod(method)} className="focus:ring-emerald-500 h-4 w-4 text-emerald-600"/>
                                            <span className="ml-2 text-sm">{method}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right border-t pt-4 mt-4">
                                <p className="text-slate-600">Total Refund Amount</p>
                                <p className="text-3xl font-bold text-red-600">- Ksh {refundTotal.toFixed(2)}</p>
                            </div>
                             {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <button onClick={handleProcessReturn} className="w-full mt-4 bg-red-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-red-700">Process Refund</button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ReturnReceiptView;