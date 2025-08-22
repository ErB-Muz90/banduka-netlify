import React from 'react';
import { Layaway } from '../../types';

interface LayawayListViewProps {
    layaways: Layaway[];
    onSelectLayaway: (layaway: Layaway) => void;
}

const StatusBadge: React.FC<{ status: Layaway['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
        case 'Active': return <span className={`${baseClasses} text-blue-800 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300`}>Active</span>;
        case 'Completed': return <span className={`${baseClasses} text-green-800 bg-green-100 dark:bg-green-900/50 dark:text-green-300`}>Completed</span>;
        case 'Defaulted': return <span className={`${baseClasses} text-red-800 bg-red-100 dark:bg-red-900/50 dark:text-red-300`}>Defaulted</span>;
        case 'Cancelled': return <span className={`${baseClasses} text-slate-800 bg-slate-100 dark:bg-slate-700 dark:text-slate-300`}>Cancelled</span>;
        default: return <span className={`${baseClasses} text-slate-800 bg-slate-100`}>Unknown</span>;
    }
};

const LayawayListView: React.FC<LayawayListViewProps> = ({ layaways, onSelectLayaway }) => {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Layaway List</h1>
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Layaway #</th>
                            <th scope="col" className="px-6 py-3">Customer</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Date Created</th>
                            <th scope="col" className="px-6 py-3 text-right">Balance Due</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {layaways.map(layaway => (
                            <tr key={layaway.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" onClick={() => onSelectLayaway(layaway)}>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{layaway.id}</td>
                                <td className="px-6 py-4">{layaway.customerName}</td>
                                <td className="px-6 py-4"><StatusBadge status={layaway.status} /></td>
                                <td className="px-6 py-4">{new Date(layaway.createdDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right font-mono font-semibold text-red-600">{layaway.balance.toFixed(2)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline">View Details</button>
                                </td>
                            </tr>
                        ))}
                         {layaways.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-500 dark:text-slate-400">No layaways found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LayawayListView;