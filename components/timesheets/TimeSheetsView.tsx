import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TimeClockEvent, User, Permission } from '../../types';
import ConfirmationModal from '../common/ConfirmationModal';

interface TimeSheetsViewProps {
    timeClockEvents: TimeClockEvent[];
    users: User[];
    permissions: Permission[];
    onAddRequest: () => void;
    onEditRequest: (event: TimeClockEvent) => void;
    onDeleteRequest: (eventId: string) => void;
}

const formatDuration = (start: Date, end?: Date): string => {
    if (!end) return 'Active';
    const diff = new Date(end).getTime() - new Date(start).getTime();
    if (diff < 0) return 'Invalid';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
};

const TimeSheetsView: React.FC<TimeSheetsViewProps> = ({ timeClockEvents, users, permissions, onAddRequest, onEditRequest, onDeleteRequest }) => {
    const [userFilter, setUserFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [eventToDelete, setEventToDelete] = useState<TimeClockEvent | null>(null);

    const canManage = permissions.includes('manage_timesheets');

    const filteredEvents = useMemo(() => {
        const start = dateFrom ? new Date(dateFrom) : null;
        if (start) start.setHours(0, 0, 0, 0);
        
        const end = dateTo ? new Date(dateTo) : null;
        if (end) end.setHours(23, 59, 59, 999);
        
        return timeClockEvents
            .filter(event => userFilter === 'all' || event.userId === userFilter)
            .filter(event => {
                const eventDate = new Date(event.clockInTime);
                if (start && eventDate < start) return false;
                if (end && eventDate > end) return false;
                return true;
            })
            .sort((a, b) => new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime());
    }, [timeClockEvents, userFilter, dateFrom, dateTo]);

    const totalHours = useMemo(() => {
        const totalMillis = filteredEvents.reduce((acc, event) => {
            if (event.clockOutTime) {
                return acc + (new Date(event.clockOutTime).getTime() - new Date(event.clockInTime).getTime());
            }
            return acc;
        }, 0);
        return totalMillis / 3600000;
    }, [filteredEvents]);

    return (
        <div className="p-4 md:p-8">
            {eventToDelete && (
                <ConfirmationModal 
                    title="Delete Time Entry?"
                    message={`Are you sure you want to delete this time clock entry for ${eventToDelete.userName}? This cannot be undone.`}
                    onConfirm={() => {
                        onDeleteRequest(eventToDelete.id);
                        setEventToDelete(null);
                    }}
                    onClose={() => setEventToDelete(null)}
                    confirmText="Delete"
                    isDestructive
                />
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Staff Time Sheets</h1>
                {canManage && (
                    <motion.button 
                        onClick={onAddRequest}
                        whileTap={{ scale: 0.95 }}
                        className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-md flex items-center"
                    >
                        Add Manual Entry
                    </motion.button>
                )}
            </div>

            <div className="my-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200">
                        <option value="all">All Staff</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200" />
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200" />
                </div>
                 <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">Total Hours (Filtered)</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalHours.toFixed(2)} hours</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-x-auto">
                 <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50 font-bold">
                        <tr>
                            <th scope="col" className="px-6 py-3">Staff Member</th>
                            <th scope="col" className="px-6 py-3">Clock In</th>
                            <th scope="col" className="px-6 py-3">Clock Out</th>
                            <th scope="col" className="px-6 py-3">Duration</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map(event => (
                            <tr key={event.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{event.userName}</td>
                                <td className="px-6 py-4">{new Date(event.clockInTime).toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })}</td>
                                <td className="px-6 py-4">{event.clockOutTime ? new Date(event.clockOutTime).toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' }) : <span className="text-green-600 font-semibold">Active</span>}</td>
                                <td className="px-6 py-4 font-mono font-semibold">{formatDuration(event.clockInTime, event.clockOutTime)}</td>
                                <td className="px-6 py-4 text-right">
                                    {canManage && (
                                        <div className="space-x-4">
                                            <button onClick={() => onEditRequest(event)} className="font-medium text-emerald-600 hover:underline">Edit</button>
                                            <button onClick={() => setEventToDelete(event)} className="font-medium text-red-600 hover:underline">Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default TimeSheetsView;