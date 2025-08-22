import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';

interface SignUpViewProps {
    onSignUp: (userData: Omit<User, 'id' | 'role'>) => Promise<boolean>;
    onSwitchToLogin: () => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const EyeIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
);

const SignUpView: React.FC<SignUpViewProps> = ({ onSignUp, onSwitchToLogin, showToast }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const getPasswordStrength = (password: string) => {
        let score = 0;
        if (!password) return 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        return score;
    };

    const passwordStrength = useMemo(() => {
        if (!password) return { score: 0, label: '', color: 'bg-slate-200' };
        const score = getPasswordStrength(password);
        switch (score) {
            case 0:
            case 1:
                return { score, label: 'Weak', color: 'bg-red-500' };
            case 2:
                return { score, label: 'Medium', color: 'bg-orange-500' };
            case 3:
                return { score, label: 'Strong', color: 'bg-green-400' };
            case 4:
                return { score, label: 'Very Strong', color: 'bg-green-600' };
            default:
                return { score: 0, label: '', color: 'bg-slate-200' };
        }
    }, [password]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!name.trim()) {
            setError('Business name is required.');
            return;
        }
        
        if (!email.trim()) {
            setError('Email address is required.');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        
        try {
            const success = await onSignUp({ name: name.trim(), email: email.trim(), password });
            if (!success) {
                setError('Failed to create account. Please try again.');
            }
        } catch (error) {
            setError('An error occurred during signup. Please try again.');
            console.error('Signup error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div 
                {...{
                    initial: { opacity: 0, y: -20 },
                    animate: { opacity: 1, y: 0 }
                }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
                    <div className="mb-6 text-center">
                        <h2 className="text-center text-3xl font-extrabold text-slate-900">Banduka POS™</h2>
                        <p className="mt-2 text-center text-sm text-slate-600">
                           Point of Sale System
                        </p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button onClick={onSwitchToLogin} className="w-1/2 py-2 text-sm font-semibold text-slate-500 rounded-md">
                            Sign In
                        </button>
                         <button className="w-1/2 py-2 text-sm font-semibold text-emerald-600 bg-white rounded-md shadow-sm">
                            Sign Up
                        </button>
                    </div>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Business Name</label>
                            <input id="name" type="text" placeholder="Enter your business name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"/>
                        </div>
                         <div>
                            <label htmlFor="email-signup" className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input id="email-signup" type="email" placeholder="Enter your email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"/>
                        </div>
                        
                        <div>
                            <label htmlFor="password-signup"className="block text-sm font-medium text-slate-700">Password</label>
                            <div className="mt-1 relative">
                                <input id="password-signup" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"/>
                                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Password Strength</span>
                                <span className={`font-semibold transition-colors ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                                <motion.div
                                    className={`h-1.5 rounded-full ${passwordStrength.color}`}
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${passwordStrength.score * 25}%` }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword"className="block text-sm font-medium text-slate-700">Confirm Password</label>
                             <div className="mt-1 relative">
                                <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"/>
                                 <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                        
                        {error && (
                            <p className="text-center text-sm text-red-600">{error}</p>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center mt-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center text-xs text-slate-500">
                        <p>Built by Eruns Technologies</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUpView;