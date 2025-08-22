import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LoginViewProps {
    onLogin: (email: string, password: string) => Promise<boolean>;
    onForgotPassword: () => void;
    onNavigateToSignUp: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onForgotPassword, onNavigateToSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await onLogin(email, password);
        // Error is now handled by a toast in App.tsx
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
                        <button className="w-1/2 py-2 text-sm font-semibold text-emerald-600 bg-white rounded-md shadow-sm">
                            Sign In
                        </button>
                        <button onClick={onNavigateToSignUp} className="w-1/2 py-2 text-sm font-semibold text-slate-500 rounded-md">
                            Sign Up
                        </button>
                    </div>

                    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        
                        {error && (
                            <p className="text-center text-sm text-red-600">{error}</p>
                        )}
                        
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="text-center text-sm">
                            <button
                                type="button"
                                onClick={onForgotPassword}
                                className="font-medium text-emerald-600 hover:text-emerald-500"
                            >
                                Forgot your password?
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

export default LoginView;