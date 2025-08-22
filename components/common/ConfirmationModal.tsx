import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
    confirmText?: string;
    isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    title,
    message,
    onConfirm,
    onClose,
    confirmText,
    isDestructive = false
}) => {
    const [inputValue, setInputValue] = useState('');
    const isConfirmed = confirmText ? inputValue === confirmText : true;

    return (
        <motion.div
            {...{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 }
            }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        >
            <motion.div
                {...{
                    initial: { scale: 0.9, opacity: 0 },
                    animate: { scale: 1, opacity: 1 },
                    exit: { scale: 0.9, opacity: 0 },
                    transition: { type: 'spring', stiffness: 300, damping: 30 }
                }}
                className="bg-card dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-md p-6"
            >
                <h3 className="text-lg font-bold text-foreground dark:text-dark-foreground">{title}</h3>
                <p className="text-sm text-foreground/70 dark:text-dark-foreground/70 mt-2">{message}</p>
                
                {confirmText && (
                    <div className="mt-4">
                        <label htmlFor="confirm-input" className="block text-sm font-medium text-foreground dark:text-dark-foreground">
                            To confirm, please type "<span className="font-bold">{confirmText}</span>"
                        </label>
                        <input
                            type="text"
                            id="confirm-input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-card dark:bg-dark-background border border-border dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-danger focus:border-danger sm:text-sm"
                        />
                    </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3">
                    <motion.button 
                        onClick={onClose} 
                        {...{ whileTap: { scale: 0.95 } }}
                        className="px-4 py-2 text-sm font-bold bg-background text-foreground dark:bg-dark-border dark:text-dark-foreground rounded-md hover:bg-border dark:hover:bg-dark-border/50"
                    >
                        Cancel
                    </motion.button>
                     <motion.button 
                        onClick={onConfirm} 
                        disabled={!isConfirmed}
                        {...{ whileTap: { scale: 0.95 } }}
                        className={`px-4 py-2 text-sm font-bold text-white rounded-md transition-colors ${
                            isDestructive 
                            ? 'bg-danger hover:bg-red-700 disabled:bg-red-300 dark:disabled:bg-red-900/50' 
                            : 'bg-primary hover:bg-primary-focus disabled:bg-emerald-300 dark:disabled:bg-emerald-900/50'
                        } disabled:cursor-not-allowed`}
                    >
                        {confirmText || 'Confirm'}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ConfirmationModal;