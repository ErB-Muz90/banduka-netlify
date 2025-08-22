import React from 'react';
import { WorkOrder, User } from '../../types';

interface WorkOrderListViewProps {
    workOrders: WorkOrder[];
    users: User[];
    onViewWorkOrder: (workOrder: WorkOrder) => void;
}

const StatusBadge: React.FC<{ status: WorkOrder['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
        case 'Pending': return <span className={`${baseClasses} text-yellow-800 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300`}>Pending</span>;
        case 'In Progress': return <span className={`${baseClasses} text-sky-800 bg-sky-100 dark:bg-sky-900/50 dark:text-sky-300`}>In Progress</span>;
        case 'Awaiting Parts': return <span className={`${baseClasses} text-indigo-800 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300`}>Awaiting Parts</span>;
        case 'Ready for Pickup': return <span className={`${baseClasses} text-blue-800 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300`}>Ready for Pickup</span>;
        case 'Completed': return <span className={`${baseClasses} text-green-800 bg-green-100 dark:bg-green-900/50 dark:text-green-300`}>Completed</span>;
        case 'Cancelled': return <span className={`${baseClasses} text-slate-800 bg-slate-100 dark:bg-slate-700 dark:text-slate-300`}>Cancelled</span>;
        default: return <span className={`${baseClasses} text-slate-800 bg-slate-100`}>Unknown</span>;
    }
};

const WorkOrderListView: React.FC<WorkOrderListViewProps> = ({ workOrders, users, onViewWorkOrder }) => {
    const userMap = new Map(users.map(u => [u.id, u.name]));

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Work Order List</h1>
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Work Order #</th>
                            <th scope="col" className="px-6 py-3">Customer</th>
                            <th scope="col" className="px-6 py-3">Item</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Promised By</th>
                            <th scope="col" className="px-6 py-3">Assigned To</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {workOrders.map(wo => (
                            <tr key={wo.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" onClick={() => onViewWorkOrder(wo)}>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{wo.id}</td>
                                <td className="px-6 py-4">{wo.customerName}</td>
                                <td className="px-6 py-4">{wo.itemToService}</td>
                                <td className="px-6 py-4"><StatusBadge status={wo.status} /></td>
                                <td className="px-6 py-4">{new Date(wo.promisedByDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{wo.assignedToId ? userMap.get(wo.assignedToId) || 'Unknown' : 'Unassigned'}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={(e) => { e.stopPropagation(); onViewWorkOrder(wo); }} className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline">View Details</button>
                                </td>
                            </tr>
                        ))}
                         {workOrders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-10 text-slate-500 dark:text-slate-400">No work orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WorkOrderListView;
