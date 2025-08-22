import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface HoldReceiptModalProps {
    onConfirm: (name: string) => void;
    onClose: () => void;
}

const HoldReceiptModal: React.FC<HoldReceiptModalProps> = ({ onConfirm, onClose }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(name);
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
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6"
            >
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Hold Current Sale</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Enter an optional name to easily identify this sale later.</p>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="hold-name" className="sr-only">Hold Name</label>
                        <input
                            type="text"
                            id="hold-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={`e.g., Held at ${new Date().toLocaleTimeString()}`}
                            className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            autoFocus
                        />
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <motion.button 
                            type="button"
                            onClick={onClose} 
                            whileTap={{ scale: 0.95 }} 
                            className="px-4 py-2 text-sm font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
                        >
                            Cancel
                        </motion.button>
                         <motion.button 
                            type="submit"
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 text-sm font-bold text-white rounded-md bg-emerald-600 hover:bg-emerald-700"
                        >
                            Hold Sale
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default HoldReceiptModal;
