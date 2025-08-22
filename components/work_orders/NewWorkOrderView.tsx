import React, { useState } from 'react';
import { Customer, User, Settings, WorkOrder, Shift } from '../../types';
import { motion } from 'framer-motion';

interface NewWorkOrderViewProps {
    customers: Customer[];
    users: User[];
    settings: Settings;
    onAddWorkOrder: (workOrderData: Omit<WorkOrder, 'id' | 'cashierId' | 'cashierName' | 'shiftId'>) => void;
    onBack: () => void;
    activeShift: Shift | null;
}

const NewWorkOrderView: React.FC<NewWorkOrderViewProps> = ({ customers, users, settings, onAddWorkOrder, onBack, activeShift }) => {
    const [formData, setFormData] = useState({
        customerId: customers.find(c => c.id !== 'cust001')?.id || customers[0]?.id,
        itemToService: '',
        descriptionOfWork: '',
        estimatedCost: '',
        depositPaid: '',
        assignedToId: '',
        promisedByDate: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const customer = customers.find(c => c.id === formData.customerId);
        if(!customer || !formData.itemToService || !formData.descriptionOfWork || !formData.promisedByDate) {
            alert('Please fill in all required fields.');
            return;
        }

        onAddWorkOrder({
            customerId: customer.id,
            customerName: customer.name,
            itemToService: formData.itemToService,
            descriptionOfWork: formData.descriptionOfWork,
            estimatedCost: Number(formData.estimatedCost) || 0,
            depositPaid: Number(formData.depositPaid) || 0,
            assignedToId: formData.assignedToId || undefined,
            status: 'Pending',
            createdDate: new Date(),
            promisedByDate: new Date(formData.promisedByDate),
        });
    };
    
    if (!activeShift) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-slate-700">Shift Not Active</h1>
                <p className="mt-2 text-slate-500">You must start a shift before you can create a work order.</p>
                <button onClick={onBack} className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg">Back to POS</button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 flex justify-center">
            <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit} 
                className="w-full max-w-2xl bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl space-y-6"
            >
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">New Work Order</h1>
                    <button type="button" onClick={onBack} className="text-sm font-bold text-emerald-600 hover:text-emerald-800">&larr; Back to POS</button>
                </div>

                <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Customer</label>
                    <select id="customerId" name="customerId" value={formData.customerId} onChange={handleChange} required className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="itemToService" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Item to be Serviced</label>
                    <input type="text" id="itemToService" name="itemToService" value={formData.itemToService} onChange={handleChange} required placeholder="e.g., HP Laptop, iPhone 12 Screen" className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"/>
                </div>

                <div>
                    <label htmlFor="descriptionOfWork" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description of Work</label>
                    <textarea id="descriptionOfWork" name="descriptionOfWork" value={formData.descriptionOfWork} onChange={handleChange} required rows={4} placeholder="Describe the issue and required work..." className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="estimatedCost" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Estimated Cost (Ksh)</label>
                        <input type="number" id="estimatedCost" name="estimatedCost" value={formData.estimatedCost} onChange={handleChange} className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"/>
                    </div>
                     <div>
                        <label htmlFor="depositPaid" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Deposit Paid (Ksh)</label>
                        <input type="number" id="depositPaid" name="depositPaid" value={formData.depositPaid} onChange={handleChange} className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"/>
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="assignedToId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Assign to Staff</label>
                        <select id="assignedToId" name="assignedToId" value={formData.assignedToId} onChange={handleChange} className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700">
                            <option value="">Unassigned</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="promisedByDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Promised By Date</label>
                        <input type="date" id="promisedByDate" name="promisedByDate" value={formData.promisedByDate} onChange={handleChange} required className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"/>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg text-lg hover:bg-accent">Create Work Order</button>
                </div>
            </form>
        </div>
    );
};
export default NewWorkOrderView;
