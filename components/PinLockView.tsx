import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';

interface PinLockViewProps {
    currentUser: User;
    onUnlock: () => void;
    onForceLogout: () => void;
}

const PinLockView: React.FC<PinLockViewProps> = ({ currentUser, onUnlock, onForceLogout }) => {
    const [enteredPin, setEnteredPin] = useState('');
    const [error, setError] = useState('');
    const [shake, setShake] = useState(0);

    useEffect(() => {
        if (enteredPin.length === 4) {
            checkPin();
        }
    }, [enteredPin]);

    const checkPin = () => {
        if (enteredPin === currentUser.pin) {
            onUnlock();
        } else {
            setError('Incorrect PIN. Please try again.');
            setShake(s => s + 1); // Trigger shake animation
            setTimeout(() => {
                setEnteredPin('');
                setError('');
            }, 1000);
        }
    };

    const handleKeyPress = (key: string) => {
        if (enteredPin.length < 4) {
            setEnteredPin(prev => prev + key);
        }
    };
    
    const handleBackspace = () => {
        setEnteredPin(prev => prev.slice(0, -1));
    };

    const PinDots = () => (
        <div className="flex justify-center space-x-4">
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-4 h-4 rounded-full border-2 border-slate-400"
                    animate={{ 
                        backgroundColor: i < enteredPin.length ? '#059669' : 'transparent',
                        borderColor: i < enteredPin.length ? '#059669' : '#94a3b8',
                        scale: i === enteredPin.length - 1 ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 0.2 }}
                />
            ))}
        </div>
    );

    const Keypad = () => {
        const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        return (
            <div className="grid grid-cols-3 gap-4">
                {keys.map(key => (
                    <motion.button
                        key={key}
                        onClick={() => handleKeyPress(key)}
                        whileTap={{ scale: 0.95 }}
                        className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full text-2xl font-bold text-slate-800 dark:text-slate-200"
                    >
                        {key}
                    </motion.button>
                ))}
                <div></div>
                <motion.button onClick={handleBackspace} whileTap={{ scale: 0.95 }} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-800 dark:text-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </motion.button>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4"
        >
            <motion.div
                className="w-full max-w-sm text-center"
                animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
                transition={{ duration: 0.4 }}
                onAnimationComplete={() => setShake(0)}
            >
                <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-3xl mx-auto mb-4 border-4 border-white/20">
                     <span>{currentUser.name.charAt(0)}</span>
                </div>

                <h1 className="text-2xl font-bold text-white">Welcome Back, {currentUser.name}</h1>
                <p className="text-slate-300 mt-2">Enter your 4-digit PIN to unlock.</p>
                
                <div className="my-8">
                    <PinDots />
                </div>
                
                 <AnimatePresence>
                    {error && (
                         <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-400 font-semibold mb-4">{error}</motion.p>
                    )}
                </AnimatePresence>
                
                <div className="max-w-xs mx-auto">
                    <Keypad />
                </div>
                
                <div className="mt-8">
                    <button onClick={onForceLogout} className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
                        Not you? Logout
                    </button>
                </div>

            </motion.div>
        </motion.div>
    );
};

export default PinLockView;