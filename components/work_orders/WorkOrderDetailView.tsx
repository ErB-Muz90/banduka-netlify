import React, { useState, useRef } from 'react';
import { WorkOrder, User, Settings } from '../../types';
import { motion } from 'framer-motion';
import JobCardDocument from './JobCardDocument';

interface WorkOrderDetailViewProps {
    workOrder: WorkOrder;
    users: User[];
    settings: Settings;
    onBack: () => void;
    onUpdate: (workOrder: WorkOrder) => void;
    onPushToPOS: (workOrder: WorkOrder) => void;
}

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-bold rounded-t-md relative transition-colors ${
            isActive 
            ? 'text-emerald-600 bg-white dark:bg-slate-800' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
        }`}
    >
        {label}
        {isActive && (
            <motion.div layoutId="wo-detail-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
        )}
    </button>
);


const WorkOrderDetailView: React.FC<WorkOrderDetailViewProps> = ({ workOrder, users, settings, onBack, onUpdate, onPushToPOS }) => {
    const [status, setStatus] = useState(workOrder.status);
    const [assignedToId, setAssignedToId] = useState(workOrder.assignedToId || '');
    const jobCardRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'job_card'>('details');

    const hasChanges = status !== workOrder.status || assignedToId !== (workOrder.assignedToId || '');
    const canPushToPOS = workOrder.status === 'Ready for Pickup' || (workOrder.status === 'Completed' && (workOrder.estimatedCost - workOrder.depositPaid > 0));

    const handleUpdate = () => {
        const updatedWorkOrder = {
            ...workOrder,
            status,
            assignedToId: assignedToId || undefined,
            completedDate: status === 'Completed' && !workOrder.completedDate ? new Date() : workOrder.completedDate
        };
        onUpdate(updatedWorkOrder);
    };

    const handlePrint = () => {
        // Switch to job card tab to ensure it's rendered for printing, then print.
        const originalTab = activeTab;
        setActiveTab('job_card');
        setTimeout(() => {
            window.print();
            // Optional: switch back to the original tab after printing
            // setActiveTab(originalTab); 
        }, 100); // Small delay to allow react to render the component
    };

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-slate-100 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center no-print">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Work Order Details</h1>
                        <p className="font-mono text-slate-500 dark:text-slate-400">{workOrder.id}</p>
                    </div>
                    <button onClick={onBack} className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800">&larr; Back to List</button>
                </div>
                
                <div className="flex justify-between items-center no-print">
                    <div className="flex space-x-1 border-b border-slate-300 dark:border-slate-700">
                        <TabButton label="Details & Status" isActive={activeTab === 'details'} onClick={() => setActiveTab('details')} />
                        <TabButton label="Job Card" isActive={activeTab === 'job_card'} onClick={() => setActiveTab('job_card')} />
                    </div>
                     <div className="flex items-center gap-4">
                        <motion.button onClick={handlePrint} whileTap={{scale: 0.95}} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700">
                            Print Job Card
                        </motion.button>
                        {canPushToPOS && (
                            <motion.button 
                                onClick={() => onPushToPOS(workOrder)} 
                                whileTap={{scale: 0.95}} 
                                className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                            >
                                Push to POS for Invoicing
                            </motion.button>
                        )}
                    </div>
                </div>

                 <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                 >
                    {activeTab === 'details' ? (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Customer</h3>
                                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{workOrder.customerName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Item for Service</h3>
                                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{workOrder.itemToService}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Description of Work</h3>
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md mt-1">{workOrder.descriptionOfWork}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t dark:border-slate-700">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Work Order Status</label>
                                    <select id="status" value={status} onChange={e => setStatus(e.target.value as WorkOrder['status'])} className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">
                                        <option>Pending</option>
                                        <option>In Progress</option>
                                        <option>Awaiting Parts</option>
                                        <option>Ready for Pickup</option>
                                        <option>Completed</option>
                                        <option>Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="assignedToId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Assign to Staff</label>
                                    <select id="assignedToId" value={assignedToId} onChange={e => setAssignedToId(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">
                                        <option value="">Unassigned</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            {hasChanges && (
                                <div className="flex justify-end">
                                    <motion.button onClick={handleUpdate} whileTap={{scale: 0.95}} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                                        Save Changes
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div id="job-card-container">
                            <JobCardDocument ref={jobCardRef} workOrder={workOrder} users={users} settings={settings} />
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default WorkOrderDetailView;
