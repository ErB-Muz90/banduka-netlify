


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';

interface ForgotPasswordViewProps {
    onFindUser: (email: string) => Promise<User | null>;
    onResetPassword: (password: string) => void;
    onBackToLogin: () => void;
}

const Step: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
        {children}
    </motion.div>
);


const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onFindUser, onResetPassword, onBackToLogin }) => {
    const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [mockOtp, setMockOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const user = await onFindUser(email);
        setIsLoading(false);
        if (user) {
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setMockOtp(generatedOtp);
            // In a real app, your backend would email this 'generatedOtp' to the user.
            // The frontend should not know or display it.
            setStep('otp');
        } else {
            setError('No user found with that email address.');
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otp === mockOtp) {
            setStep('reset');
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };
    
    const handleResetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        onResetPassword(password);
    };


    const renderStepContent = () => {
        switch(step) {
            case 'email':
                return (
                    <Step key="email">
                        <h1 className="text-2xl font-bold text-slate-800">Reset Password</h1>
                        <p className="text-slate-500 mt-2">Enter your email to receive a recovery code.</p>
                        <form onSubmit={handleEmailSubmit} className="mt-8 space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                            </div>
                            <motion.button type="submit" disabled={isLoading} {...{ whileTap: { scale: 0.98 } }} className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400">
                                {isLoading ? 'Searching...' : 'Send Code'}
                            </motion.button>
                        </form>
                    </Step>
                );
            case 'otp':
                 return (
                    <Step key="otp">
                        <h1 className="text-2xl font-bold text-slate-800">Enter Code</h1>
                        <p className="text-slate-500 mt-2">A 6-digit recovery code has been sent to <span className="font-semibold">{email}</span>. Please check your inbox and enter the code below.</p>
                        <form onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-slate-700">One-Time Password</label>
                                <input id="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md tracking-widest text-center text-lg" />
                            </div>
                            <motion.button type="submit" {...{ whileTap: { scale: 0.98 } }} className="w-full py-3 px-4 rounded-md text-white bg-emerald-600 hover:bg-emerald-700">Verify Code</motion.button>
                        </form>
                    </Step>
                );
            case 'reset':
                 return (
                    <Step key="reset">
                        <h1 className="text-2xl font-bold text-slate-800">Create New Password</h1>
                        <p className="text-slate-500 mt-2">Please enter a new password for your account.</p>
                        <form onSubmit={handleResetSubmit} className="mt-8 space-y-4">
                            <div>
                                <label htmlFor="password"className="block text-sm font-medium text-slate-700">New Password</label>
                                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md"/>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword"className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                                <input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md"/>
                            </div>
                            <motion.button type="submit" {...{ whileTap: { scale: 0.98 } }} className="w-full py-3 px-4 rounded-md text-white bg-emerald-600 hover:bg-emerald-700">Set New Password</motion.button>
                        </form>
                    </Step>
                );
            default: return null;
        }
    }

    return (
        <div className="h-screen w-screen bg-slate-100 flex items-center justify-center p-4">
            <motion.div
                {...{
                    initial: { opacity: 0, y: -20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.5 }
                }}
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Banduka POS™</h2>
                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>
                    {error && <p className="text-center text-sm text-red-600 mt-4">{error}</p>}
                </div>
                <div className="mt-6 text-center">
                    <button onClick={onBackToLogin} className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                        &larr; Back to Login
                    </button>
                </div>
                <div className="mt-6 text-center text-xs text-slate-500">
                    <p>Built by Eruns Technologies</p>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordView;