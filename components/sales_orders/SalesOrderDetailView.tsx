import React from 'react';
import { SalesOrder } from '../../types';
import { motion } from 'framer-motion';

interface SalesOrderDetailViewProps {
    salesOrder: SalesOrder;
    onBack: () => void;
    onCreatePO: (salesOrder: SalesOrder) => void;
    onPushToPOS: (salesOrder: SalesOrder) => void;
}

const getStatusIndex = (status: SalesOrder['status']): number => {
    switch (status) {
        case 'Pending': return 0;
        case 'Ordered': return 1;
        case 'Partially Received': return 2;
        case 'Received': return 2;
        case 'Completed': return 3;
        case 'Cancelled': return -1; // Special case
        default: return 0;
    }
};

const ProgressBar: React.FC<{ currentStatus: SalesOrder['status'] }> = ({ currentStatus }) => {
    const statusSteps = ['Pending', 'Ordered', 'Received', 'Completed'];
    const currentIndex = getStatusIndex(currentStatus);

    if (currentStatus === 'Cancelled') {
        return (
            <div className="text-center p-4 bg-slate-200 dark:bg-slate-700 rounded-md">
                <p className="font-bold text-red-600 dark:text-red-400">Order Cancelled</p>
            </div>
        );
    }
    
    return (
        <div className="flex items-center w-full">
            {statusSteps.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isActive = index === currentIndex;
                const effectiveStatus = (step === 'Received' && currentStatus === 'Partially Received') ? 'Partially Received' : step;
                
                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center text-center flex-shrink-0 w-24">
                            <motion.div
                                animate={{ scale: isActive ? 1.1 : 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-300
                                    ${isCompleted ? 'bg-green-600' : isActive ? 'bg-blue-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}
                            >
                                {isCompleted ? '✓' : index + 1}
                            </motion.div>
                            <p className={`mt-2 text-xs font-semibold transition-colors duration-300
                                ${isActive ? 'text-blue-600 dark:text-blue-400' : isCompleted ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                                {effectiveStatus}
                            </p>
                        </div>
                        {index < statusSteps.length - 1 && (
                            <div className={`flex-grow h-1 transition-colors duration-300 ${isCompleted ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};


const SalesOrderDetailView: React.FC<SalesOrderDetailViewProps> = ({ salesOrder, onBack, onCreatePO, onPushToPOS }) => {
    const canCreatePO = salesOrder.status === 'Pending' && salesOrder.items.some(i => i.status === 'Pending');
    const canPushToPOS = salesOrder.status === 'Received';
    
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-slate-100 dark:bg-slate-900">
             <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Sales Order Details</h1>
                        <p className="font-mono text-slate-500 dark:text-slate-400">{salesOrder.id}</p>
                    </div>
                    <button onClick={onBack} className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800">&larr; Back to List</button>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">Order Progress</h2>
                    <ProgressBar currentStatus={salesOrder.status} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 border-b dark:border-slate-700 pb-2">Ordered Items</h2>
                        <ul className="divide-y dark:divide-slate-700 max-h-96 overflow-y-auto">
                            {salesOrder.items.map(item => (
                               <li key={item.id} className="p-3 flex justify-between items-center">
                                   <div>
                                       <p className="font-bold text-slate-800 dark:text-slate-100">{item.description}</p>
                                       <p className="text-xs text-slate-500 dark:text-slate-400">{item.quantity} x Ksh {item.unitPrice.toFixed(2)}</p>
                                   </div>
                                   <div>
                                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                           item.status === 'Received' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                                           item.status === 'Ordered' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                                           'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                       }`}>{item.status}</span>
                                   </div>
                               </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                             <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Order Information</h2>
                             <div className="space-y-2 text-sm">
                                 <div><strong className="text-slate-500 dark:text-slate-400">Customer:</strong> <span className="font-semibold text-slate-800 dark:text-slate-200">{salesOrder.customerName}</span></div>
                                 <div><strong className="text-slate-500 dark:text-slate-400">Date:</strong> <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date(salesOrder.createdDate).toLocaleDateString()}</span></div>
                                 <div><strong className="text-slate-500 dark:text-slate-400">Delivery By:</strong> <span className="font-semibold text-slate-800 dark:text-slate-200">{salesOrder.deliveryDate ? new Date(salesOrder.deliveryDate).toLocaleDateString() : 'N/A'}</span></div>
                             </div>
                             <div className="mt-4 pt-4 border-t dark:border-slate-700">
                                <strong className="text-slate-500 text-sm dark:text-slate-400">Notes/Address:</strong>
                                <p className="text-sm p-2 bg-slate-50 dark:bg-slate-700/50 rounded mt-1">{salesOrder.notes || 'No notes provided.'}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md space-y-2">
                             <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">Total</span><span className="font-mono font-semibold">Ksh {salesOrder.total.toFixed(2)}</span></div>
                             <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">Deposit Paid</span><span className="font-mono font-semibold">Ksh {salesOrder.deposit.toFixed(2)}</span></div>
                             <div className="flex justify-between font-bold text-lg text-red-600 dark:text-red-400 pt-2 border-t dark:border-slate-700"><span>Balance Due</span><span className="font-mono">Ksh {salesOrder.balance.toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex justify-end items-center gap-4">
                     {canCreatePO && (
                         <motion.button onClick={() => onCreatePO(salesOrder)} whileTap={{scale: 0.95}} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700">
                            Create Purchase Order
                        </motion.button>
                     )}
                     {canPushToPOS && (
                        <motion.button onClick={() => onPushToPOS(salesOrder)} whileTap={{scale: 0.95}} className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700">
                           Push to POS for Completion
                        </motion.button>
                     )}
                     {!canCreatePO && !canPushToPOS && salesOrder.status !== 'Cancelled' && (
                         <p className="text-slate-500 dark:text-slate-400 font-semibold">
                             {salesOrder.status === 'Ordered' && 'Waiting for items to be received.'}
                              {salesOrder.status === 'Partially Received' && 'Waiting for remaining items to be received.'}
                             {salesOrder.status === 'Completed' && 'This order has been completed.'}
                         </p>
                     )}
                </div>
            </div>
        </div>
    );
};

export default SalesOrderDetailView;
