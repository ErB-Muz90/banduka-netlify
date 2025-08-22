import React, { useState, useMemo } from 'react';
import { Product, CartItem, Customer, Settings, Layaway, Shift } from '../../types';
import ProductGrid from '../pos/ProductGrid';
import { motion } from 'framer-motion';

interface NewLayawayViewProps {
    products: Product[];
    customers: Customer[];
    settings: Settings;
    onAddLayaway: (layawayData: Omit<Layaway, 'id' | 'balance' | 'cashierId' | 'cashierName' | 'shiftId'>) => void;
    onBack: () => void;
    activeShift: Shift | null;
}

const NewLayawayView: React.FC<NewLayawayViewProps> = ({ products, customers, settings, onAddLayaway, onBack, activeShift }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(customers.find(c => c.id !== 'cust001')?.id || customers[0]?.id);
    const [deposit, setDeposit] = useState<number | ''>('');
    const [expiryDate, setExpiryDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 30); // Default 30 days
        return date.toISOString().split('T')[0];
    });
    
    const [error, setError] = useState('');

    const addToCart = (product: Product) => {
        if (product.stock <= 0 && product.productType === 'Inventory') return;
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev;
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };
    
    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const total = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
    const minDeposit = total * 0.20; // Example: 20% minimum deposit

    const handleCreateLayaway = () => {
        setError('');
        const customer = customers.find(c => c.id === selectedCustomerId);
        if (!customer || customer.id === 'cust001') {
            setError('Please select a valid customer (not Walk-in).');
            return;
        }
         if (cart.length === 0) {
            setError('Please add items to the layaway plan.');
            return;
        }
        if (deposit === '' || Number(deposit) < minDeposit) {
            setError(`Deposit must be at least the minimum required of Ksh ${minDeposit.toFixed(2)}.`);
            return;
        }
        if (!expiryDate) {
            setError('Please set a valid expiry date.');
            return;
        }

        onAddLayaway({
            customerId: customer.id,
            customerName: customer.name,
            items: cart,
            total: total,
            payments: [{
                date: new Date(),
                amount: Number(deposit),
                method: 'Cash', // Assuming cash for initial deposit for simplicity
                cashierId: '' // This will be set in App.tsx
            }],
            deposit: Number(deposit),
            status: 'Active',
            createdDate: new Date(),
            expiryDate: new Date(expiryDate),
        });
    };

    if (!activeShift) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-slate-700">Shift Not Active</h1>
                <p className="mt-2 text-slate-500">You must start a shift before you can create a layaway plan.</p>
                <button onClick={onBack} className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg">Back to POS</button>
            </div>
        );
    }


    return (
        <div className="h-full grid grid-cols-1 md:grid-cols-[1fr_auto] overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto">
                <ProductGrid products={products} onAddToCart={addToCart} />
            </div>
            <div className="w-full md:w-96 bg-card dark:bg-dark-card shadow-lg flex flex-col p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">New Layaway</h2>
                     <button onClick={onBack} className="text-sm font-bold text-emerald-600 hover:text-emerald-800">&larr; Back to POS</button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Customer</label>
                    <select value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">
                        {customers.filter(c => c.id !== 'cust001').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex-grow overflow-y-auto border-t border-b border-slate-200 dark:border-slate-700 py-2 space-y-2">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-1 group">
                            <div className="text-sm">
                                <p className="font-semibold text-slate-700 dark:text-slate-200">{item.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{item.quantity} x {item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-slate-800 dark:text-slate-200">{(item.price * item.quantity).toFixed(2)}</span>
                                 <button onClick={() => removeFromCart(item.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                            </div>
                        </div>
                    ))}
                     {cart.length === 0 && <p className="text-center text-slate-500 dark:text-slate-400 py-4">Add products to start</p>}
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="font-mono">Ksh {total.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400"><span>Minimum Deposit (20%)</span><span className="font-mono">Ksh {minDeposit.toFixed(2)}</span></div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Deposit Paid</label>
                    <input type="number" value={deposit} onChange={e => setDeposit(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" placeholder={minDeposit.toFixed(2)} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Expiry Date</label>
                    <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div className="pt-2">
                    <button onClick={handleCreateLayaway} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-accent disabled:bg-slate-400" disabled={cart.length === 0}>
                        Create Layaway
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewLayawayView;