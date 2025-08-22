import React from 'react';
import { SalesOrder } from '../../types';

interface SalesOrderListViewProps {
    salesOrders: SalesOrder[];
    onViewSalesOrder: (salesOrder: SalesOrder) => void;
}

const StatusBadge: React.FC<{ status: SalesOrder['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
        case 'Pending': return <span className={`${baseClasses} text-yellow-800 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300`}>Pending</span>;
        case 'Ordered': return <span className={`${baseClasses} text-indigo-800 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300`}>Ordered</span>;
        case 'Partially Received': return <span className={`${baseClasses} text-sky-800 bg-sky-100 dark:bg-sky-900/50 dark:text-sky-300`}>Partially Received</span>;
        case 'Received': return <span className={`${baseClasses} text-blue-800 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300`}>Received</span>;
        case 'Completed': return <span className={`${baseClasses} text-green-800 bg-green-100 dark:bg-green-900/50 dark:text-green-300`}>Completed</span>;
        case 'Cancelled': return <span className={`${baseClasses} text-slate-800 bg-slate-100 dark:bg-slate-700 dark:text-slate-300`}>Cancelled</span>;
        default: return <span className={`${baseClasses} text-slate-800 bg-slate-100`}>Unknown</span>;
    }
};

const SalesOrderListView: React.FC<SalesOrderListViewProps> = ({ salesOrders, onViewSalesOrder }) => {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Sales Order List</h1>
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Order #</th>
                            <th scope="col" className="px-6 py-3">Customer</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Date Created</th>
                            <th scope="col" className="px-6 py-3 text-right">Balance Due</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesOrders.map(so => (
                            <tr key={so.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" onClick={() => onViewSalesOrder(so)}>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{so.id}</td>
                                <td className="px-6 py-4">{so.customerName}</td>
                                <td className="px-6 py-4"><StatusBadge status={so.status} /></td>
                                <td className="px-6 py-4">{new Date(so.createdDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right font-mono font-semibold text-red-600">{so.balance.toFixed(2)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={(e) => { e.stopPropagation(); onViewSalesOrder(so); }} className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline">View Details</button>
                                </td>
                            </tr>
                        ))}
                         {salesOrders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-500 dark:text-slate-400">No sales orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesOrderListView;