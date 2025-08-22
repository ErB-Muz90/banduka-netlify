import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Customer, Sale, Permission, Settings } from '../types';
import CustomerDetailView from './customers/CustomerDetailView';
import CustomerModal from './customers/CustomerModal';
import { ICONS } from '../constants';

interface CustomersViewProps {
    customers: Customer[];
    sales: Sale[];
    onAddCustomer: (customer: Omit<Customer, 'id' | 'dateAdded' | 'loyaltyPoints'>) => void;
    onUpdateCustomer: (customer: Customer) => void;
    onDeleteCustomer: (customerId: string) => void;
    permissions: Permission[];
    settings: Settings;
}

const CustomersView: React.FC<CustomersViewProps> = ({ customers, sales, onAddCustomer, onUpdateCustomer, onDeleteCustomer, permissions, settings }) => {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

    const canManage = permissions.includes('manage_customers');

    const customerData = useMemo(() => {
        return customers.map(customer => {
            const customerSales = sales.filter(s => s.customerId === customer.id);
            const totalSpent = customerSales.reduce((acc, s) => acc + s.total, 0);
            const lastPurchase = customerSales.length > 0
                ? new Date(Math.max(...customerSales.map(s => new Date(s.date).getTime())))
                : null;
            return {
                ...customer,
                totalSpent,
                lastPurchase,
            };
        }).filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [customers, sales, searchTerm]);

    const handleOpenModal = (customer?: Customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'dateAdded' | 'loyaltyPoints'> | Customer) => {
        if ('id' in customerData) {
            onUpdateCustomer(customerData as Customer);
        } else {
            onAddCustomer(customerData);
        }
        setIsModalOpen(false);
    };
    
    if (selectedCustomer) {
        const fullCustomerData = customerData.find(c => c.id === selectedCustomer.id);
        return (
            <CustomerDetailView 
                customer={fullCustomerData || selectedCustomer} 
                sales={sales.filter(s => s.customerId === selectedCustomer.id)}
                onBack={() => setSelectedCustomer(null)}
                settings={settings}
                onUpdateCustomer={onUpdateCustomer}
            />
        );
    }
    
    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Customer Management</h1>
                 <div className="flex items-center space-x-2">
                    {canManage && (
                        <motion.button 
                            onClick={() => handleOpenModal()}
                            whileTap={{ scale: 0.95 }}
                            className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-md flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            Add Customer
                        </motion.button>
                    )}
                </div>
            </div>
            <div className="mb-4">
                 <input
                    type="text"
                    placeholder="Search customers by name, phone, or email..."
                    className="w-full max-w-sm px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50 font-bold">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Contact</th>
                            <th scope="col" className="px-6 py-3">Loyalty Points</th>
                            <th scope="col" className="px-6 py-3">Total Spent (Ksh)</th>
                            <th scope="col" className="px-6 py-3">Last Purchase</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerData.map(customer => (
                            <tr key={customer.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{customer.name}</td>
                                <td className="px-6 py-4">
                                    <div>{customer.phone}</div>
                                    <div className="text-xs text-slate-400 dark:text-slate-500">{customer.email}</div>
                                </td>
                                <td className="px-6 py-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">{customer.loyaltyPoints}</td>
                                <td className="px-6 py-4 font-mono">{customer.totalSpent.toFixed(2)}</td>
                                <td className="px-6 py-4">{customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' }) : 'N/A'}</td>
                                <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                    {canManage && customer.id !== 'cust001' && (
                                        <div className="space-x-4">
                                            <button onClick={() => handleOpenModal(customer)} className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline">Edit</button>
                                            <button onClick={() => onDeleteCustomer(customer.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AnimatePresence>
                {isModalOpen && (
                    <CustomerModal 
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveCustomer}
                        customer={editingCustomer}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomersView;