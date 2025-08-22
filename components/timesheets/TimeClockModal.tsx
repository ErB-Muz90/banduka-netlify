import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TimeClockEvent, User } from '../../types';

interface TimeClockModalProps {
    event: TimeClockEvent;
    users: User[];
    onClose: () => void;
    onSave: (event: TimeClockEvent) => void;
}

const formatDateTimeLocal = (date?: Date): string => {
    if (!date) return '';
    const d = new Date(date);
    // Adjust for timezone offset to display correctly in datetime-local input
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localDate = new Date(d.getTime() - tzOffset);
    return localDate.toISOString().slice(0, 16);
};

const TimeClockModal: React.FC<TimeClockModalProps> = ({ event, users, onClose, onSave }) => {
    const isNew = !event.id;
    const [userId, setUserId] = useState(event.userId || users[0]?.id || '');
    const [clockInTime, setClockInTime] = useState(formatDateTimeLocal(event.clockInTime));
    const [clockOutTime, setClockOutTime] = useState(formatDateTimeLocal(event.clockOutTime));
    const [notes, setNotes] = useState(event.notes || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedUser = users.find(u => u.id === userId);
        if (!selectedUser) {
            alert('Please select a valid user.');
            return;
        }

        const clockInDate = new Date(clockInTime);
        const clockOutDate = clockOutTime ? new Date(clockOutTime) : undefined;
        
        if(clockOutDate && clockOutDate < clockInDate) {
            alert('Clock out time cannot be before clock in time.');
            return;
        }

        const finalEvent: TimeClockEvent = {
            id: event.id || `tce_manual_${Date.now()}`,
            userId: selectedUser.id,
            userName: selectedUser.name,
            clockInTime: clockInDate,
            clockOutTime: clockOutDate,
            status: clockOutDate ? 'clocked-out' : 'clocked-in',
            notes: notes,
        };
        onSave(finalEvent);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-8"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {isNew ? 'Add Manual Time Entry' : 'Edit Time Entry'}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100">
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="user" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Staff Member</label>
                        <select
                            id="user"
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                            disabled={!isNew}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 disabled:bg-slate-100"
                        >
                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="clockInTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Clock In</label>
                            <input type="datetime-local" id="clockInTime" value={clockInTime} onChange={e => setClockInTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:text-slate-200" />
                        </div>
                        <div>
                            <label htmlFor="clockOutTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Clock Out</label>
                            <input type="datetime-local" id="clockOutTime" value={clockOutTime} onChange={e => setClockOutTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:text-slate-200" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Notes (Optional)</label>
                        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:text-slate-200" placeholder="e.g., Forgot to clock out" />
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <motion.button type="button" onClick={onClose} whileTap={{ scale: 0.95 }} className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-lg hover:bg-slate-200">Cancel</motion.button>
                        <motion.button type="submit" whileTap={{ scale: 0.95 }} className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-emerald-700 shadow-md">Save Entry</motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default TimeClockModal;
