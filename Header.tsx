'use client';
import React from 'react';
import { View } from './types';
import { ICONS } from './constants';

interface HeaderProps {
    currentView: View;
    onToggleSidebar: () => void;
    onToggleTheme: () => void;
    theme: 'light' | 'dark';
    currentUser: any;
    onLogout: () => void;
    isOnline: boolean;
    currentEvent: any;
    cartItemCount: number;
    onInstallApp?: () => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const Header: React.FC<HeaderProps> = ({
    currentView,
    onToggleSidebar,
    onToggleTheme,
    theme,
    currentUser,
    onLogout,
    isOnline,
    currentEvent,
    cartItemCount,
    onInstallApp,
    showToast
}) => {
    const getViewTitle = (view: View): string => {
        try {
            const titles: Record<string, string> = {
                'POS': 'Point of Sale',
                'Dashboard': 'Dashboard',
                'Inventory': 'Inventory Management',
                'Purchases': 'Purchase Orders',
                'AccountsPayable': 'Accounts Payable',
                'Customers': 'Customer Management',
                'Quotations': 'Quotations',
                'Staff': 'Staff Management',
                'Settings': 'Settings',
                'TaxReports': 'Tax Reports',
                'ShiftReport': 'Shift Reports',
                'TimeSheets': 'Time Sheets',
                'Layaway': 'Layaways',
                'WorkOrder': 'Work Orders',
                'SalesOrder': 'Sales Orders',
                'HeldReceipts': 'Held Receipts',
                'PaymentSummary': 'Payment Summary'
            };
            return titles[view] || 'Banduka POS™';
        } catch (error) {
            return 'Banduka POS™';
        }
    };

    return (
        <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onToggleSidebar}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" x2="21" y1="6" y2="6"/>
                        <line x1="3" x2="21" y1="12" y2="12"/>
                        <line x1="3" x2="21" y1="18" y2="18"/>
                    </svg>
                </button>
                
                <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Banduka POS™
                    </h1>
                    
                    {isOnline === false && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-xs font-medium">
                            <span>Offline</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-3">
                {currentView === 'POS' && cartItemCount > 0 && (
                    <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                        <span>Cart: {cartItemCount}</span>
                    </div>
                )}

                {currentEvent && (
                    <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                        <span>Clocked In</span>
                    </div>
                )}

                <button
                    onClick={onToggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? ICONS.moon : ICONS.sun}
                </button>

                <div className="flex items-center space-x-2">
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {currentUser?.name || 'User'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {currentUser?.role || 'Admin'}
                        </div>
                    </div>
                    
                    <button
                        onClick={onLogout}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                        aria-label="Logout"
                        title="Logout"
                    >
                        {ICONS.logout}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;