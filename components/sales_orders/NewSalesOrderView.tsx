import React, { useState, useMemo } from 'react';
import { Customer, Settings, SalesOrder, Shift, SalesOrderItem, Product } from '../../types';
import { motion } from 'framer-motion';

interface NewSalesOrderViewProps {
    products: Product[];
    customers: Customer[];
    settings: Settings;
    onAddSalesOrder: (salesOrderData: Omit<SalesOrder, 'id' | 'balance' | 'cashierId' | 'cashierName' | 'shiftId'>) => void;
    onBack: () => void;
    activeShift: Shift | null;
}

const NewSalesOrderView: React.FC<NewSalesOrderViewProps> = ({ products, customers, settings, onAddSalesOrder, onBack, activeShift }) => {
    const [selectedCustomerId, setSelectedCustomerId] = useState(customers.find(c => c.id !== 'cust001')?.id || customers[0]?.id);
    const [items, setItems] = useState<Partial<SalesOrderItem>[]>([]);
    const [deposit, setDeposit] = useState<number | ''>('');
    const [deliveryDate, setDeliveryDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7); // Default 7 days
        return date.toISOString().split('T')[0];
    });
    const [shippingAddress, setShippingAddress] = useState('');
    const [notes, setNotes] = useState('');
    
    // For the new item form
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newItemQty, setNewItemQty] = useState<number | ''>(1);
    const [newItemPrice, setNewItemPrice] = useState<number | ''>('');
    const [productSearchTerm, setProductSearchTerm] = useState('');

    const [error, setError] = useState('');

    const searchResults = useMemo(() => {
        if (!productSearchTerm) return [];
        return products.filter(p => p.name.toLowerCase().includes(productSearchTerm.toLowerCase())).slice(0, 5);
    }, [productSearchTerm, products]);
    
    const total = useMemo(() => items.reduce((sum, item) => sum + ((item.unitPrice || 0) * (item.quantity || 0)), 0), [items]);

    const handleAddProductFromSearch = (product: Product) => {
        setItems(prev => {
            const existing = prev.find(i => i.productId === product.id);
            if (existing) {
                return prev.map(i => i.productId === product.id ? { ...i, quantity: (i.quantity || 0) + 1 } : i);
            }
            return [...prev, {
                productId: product.id,
                description: product.name,
                quantity: 1,
                unitPrice: product.price,
                pricingType: product.pricingType,
            }];
        });
        setProductSearchTerm('');
    };
    
    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemDesc && newItemQty && newItemPrice) {
            setItems(prev => [...prev, {
                description: newItemDesc,
                quantity: Number(newItemQty),
                unitPrice: Number(newItemPrice),
                pricingType: 'inclusive', // Custom items are VAT inclusive
            }]);
            // Reset form
            setNewItemDesc('');
            setNewItemQty(1);
            setNewItemPrice('');
        }
    };

    const handleRemoveItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateSalesOrder = () => {
        setError('');
        const customer = customers.find(c => c.id === selectedCustomerId);
        if (!customer || customer.id === 'cust001') {
            setError('Please select a valid customer (not Walk-in).');
            return;
        }
         if (items.length === 0) {
            setError('Please add at least one item to the sales order.');
            return;
        }

        const finalItems: SalesOrderItem[] = items.map(item => ({
            id: crypto.randomUUID(),
            status: 'Pending',
            description: item.description!,
            quantity: item.quantity!,
            unitPrice: item.unitPrice!,
            pricingType: item.pricingType!,
            productId: item.productId
        }));

        onAddSalesOrder({
            customerId: customer.id,
            customerName: customer.name,
            items: finalItems,
            total: total,
            deposit: Number(deposit) || 0,
            status: 'Pending',
            createdDate: new Date(),
            deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
            shippingAddress,
            notes,
        });
    };

    if (!activeShift) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-slate-700">Shift Not Active</h1>
                <p className="mt-2 text-slate-500">You must start a shift before you can create a sales order.</p>
                <button onClick={onBack} className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg">Back to POS</button>
            </div>
        );
    }


    return (
         <div className="p-4 md:p-8 h-full overflow-y-auto bg-slate-50 flex justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-xl space-y-6"
            >
                 <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-800">New Sales Order</h1>
                    <button type="button" onClick={onBack} className="text-sm font-bold text-emerald-600 hover:text-emerald-800">&larr; Back to POS</button>
                </div>
                
                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Customer</label>
                        <select value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md">
                            {customers.filter(c => c.id !== 'cust001').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Expected Delivery Date</label>
                        <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md" />
                    </div>
                </div>

                {/* Items Section */}
                <div>
                    <h2 className="text-xl font-semibold text-slate-700 border-b pb-2 mb-4">Items</h2>
                    
                    {/* Product Search */}
                    <div className="relative mb-4">
                        <label className="block text-sm font-medium text-slate-700">Add Existing Product</label>
                        <input
                            type="text"
                            value={productSearchTerm}
                            onChange={e => setProductSearchTerm(e.target.value)}
                            placeholder="Type to search products..."
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        />
                        {searchResults.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                                {searchResults.map(p => (
                                    <li key={p.id} onClick={() => handleAddProductFromSearch(p)} className="px-4 py-2 hover:bg-slate-100 cursor-pointer">
                                        {p.name} - Ksh {p.price.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="space-y-2">
                         {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-2 bg-slate-50 rounded">
                                <p className="flex-grow font-semibold">{item.description}</p>
                                <p className="w-16 text-center">{item.quantity}</p>
                                <p className="w-24 text-right font-mono">{(item.unitPrice! * item.quantity!).toFixed(2)}</p>
                                <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">&times;</button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddItem} className="mt-4 grid grid-cols-12 gap-2 p-3 border rounded-lg">
                        <input type="text" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} placeholder="Or Add Custom Item Description" className="col-span-6 p-2 border rounded-md" required />
                        <input type="number" value={newItemQty} onChange={e => setNewItemQty(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Qty" className="col-span-2 p-2 border rounded-md" required min="1" />
                        <input type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Unit Price" className="col-span-2 p-2 border rounded-md" required min="0" step="0.01"/>
                        <button type="submit" className="col-span-2 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-800">Add</button>
                    </form>
                </div>
                
                {/* Financials & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                         <div className="flex justify-between font-bold text-lg mb-4"><span>Total</span><span className="font-mono">Ksh {total.toFixed(2)}</span></div>
                         <label className="block text-sm font-medium text-slate-700">Deposit Paid (Optional)</label>
                        <input type="number" value={deposit} onChange={e => setDeposit(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="0.00" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Notes / Shipping Address</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="mt-1 w-full p-2 border border-slate-300 rounded-md" />
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div className="pt-4 border-t">
                    <button onClick={handleCreateSalesOrder} className="w-full bg-primary text-white font-bold py-3 rounded-lg text-lg hover:bg-accent disabled:bg-slate-400" disabled={items.length === 0}>
                        Create Sales Order
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NewSalesOrderView;