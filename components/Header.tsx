'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Product, Settings, TimeClockEvent } from '../types';
import { ICONS } from '../constants';
import LowStockNotificationPopover from './notifications/LowStockNotificationPopover';

const MotionSvg = motion.svg;
const MotionDiv = motion.div;
const MotionSpan = motion.span;
const MotionButton = motion.button;

const SyncIcon = () => (
    <MotionSvg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-secondary dark:text-dark-secondary"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="currentColor"
        {...{
            animate: { rotate: 360 },
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
            }
        }}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.69a8.25 8.25 0 00-11.664 0l-3.181 3.183"
        />
    </MotionSvg>
);


interface HeaderProps {
    isOnline: boolean;
    isSyncing: boolean;
    queuedSalesCount: number;
    onMenuClick: () => void;
    currentUser: User;
    onLogout: () => void;
    products: Product[];
    currentEvent: string | null;
    settings: Settings;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    onInstallClick: () => void;
    installPromptEvent: Event | null;
    activeTimeClockEvent: TimeClockEvent | null;
    onClockIn: () => void;
    onClockOut: () => void;
}

const Header = ({ isOnline, isSyncing, queuedSalesCount, onMenuClick, currentUser, onLogout, products, currentEvent, settings, theme, onToggleTheme, onInstallClick, installPromptEvent, activeTimeClockEvent, onClockIn, onClockOut }: HeaderProps) => {
    const [time, setTime] = useState(new Date());
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [elapsedTime, setElapsedTime] = useState('');

    const lowStockProducts = useMemo(() => {
        return products.filter(p => p.productType === 'Inventory' && p.stock === 0);
    }, [products]);

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if(activeTimeClockEvent) {
            const updateElapsedTime = () => {
                const now = new Date();
                const start = new Date(activeTimeClockEvent.clockInTime);
                const diff = now.getTime() - start.getTime();
                const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                setElapsedTime(`${hours}:${minutes}:${seconds}`);
            };
            updateElapsedTime();
            interval = setInterval(updateElapsedTime, 1000);
        }
        return () => clearInterval(interval);
    }, [activeTimeClockEvent]);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsUserMenuOpen(false);
        onLogout();
    };

    const userInitials = useMemo(() => {
        if (!currentUser || !currentUser.name) return '';
        const nameParts = currentUser.name.split(' ').filter(Boolean);
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return nameParts[0] ? nameParts[0][0].toUpperCase() : '';
    }, [currentUser]);

    return (
        <header className="bg-card dark:bg-dark-card h-16 flex items-center justify-between px-4 md:px-6 border-b border-border/80 dark:border-dark-border/80 flex-shrink-0 relative z-10">
            <div className="flex items-center space-x-4">
                <button onClick={onMenuClick} className="md:hidden text-foreground/70 hover:text-primary dark:text-dark-foreground/70 dark:hover:text-dark-primary">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                 <div className="hidden sm:block">
                     {currentEvent && (
                        <MotionDiv
                            {...{
                                initial: { opacity: 0, y: -10 },
                                animate: { opacity: 1, y: 0 }
                            }}
                            className="text-xs font-bold text-accent dark:text-dark-accent"
                        >
                            {currentEvent} Edition
                        </MotionDiv>
                    )}
                     <div className="text-right hidden md:block">
                        <div className="font-bold text-foreground dark:text-dark-foreground">{time.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi' })}</div>
                        <div className="text-xs text-foreground/70 dark:text-dark-foreground/70">{time.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'Africa/Nairobi' })}</div>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
                <div className="flex items-center space-x-2 h-5">
                    <AnimatePresence mode="wait">
                        {isSyncing ? (
                            <MotionDiv key="syncing" {...{ initial: {opacity:0, y: 10}, animate: {opacity:1, y: 0}, exit: {opacity:0, y: -10}, transition: {duration: 0.2} }} className="flex items-center space-x-2">
                                <SyncIcon />
                                <span className="text-sm font-bold text-secondary dark:text-dark-secondary hidden sm:inline">
                                    Syncing...
                                </span>
                                {queuedSalesCount > 0 && (
                                    <span className="text-xs bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded-full">{queuedSalesCount}</span>
                                )}
                            </MotionDiv>
                        ) : isOnline ? (
                            <MotionDiv key="online" {...{ initial: {opacity:0, y: 10}, animate: {opacity:1, y: 0}, exit: {opacity:0, y: -10}, transition: {duration: 0.2} }} className="flex items-center space-x-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                <span className="text-sm font-bold text-primary dark:text-dark-primary hidden sm:inline">
                                    Online
                                </span>
                            </MotionDiv>
                        ) : (
                            <MotionDiv key="offline" {...{ initial: {opacity:0, y: 10}, animate: {opacity:1, y: 0}, exit: {opacity:0, y: -10}, transition: {duration: 0.2} }} className="flex items-center space-x-2">
                                <MotionDiv 
                                    {...{
                                        animate: { scale: [1, 1.1, 1] },
                                        transition: { duration: 2, repeat: Infinity, repeatDelay: 2 }
                                    }}
                                    className="w-2.5 h-2.5 rounded-full bg-danger"
                                />
                                <span className="text-sm font-bold text-danger hidden sm:inline">
                                    Offline
                                </span>
                                {queuedSalesCount > 0 && (
                                    <MotionSpan 
                                        {...{ initial: {scale: 0}, animate: {scale: 1} }}
                                        className="text-xs bg-warning text-white font-bold px-2 py-0.5 rounded-full">
                                        {queuedSalesCount}
                                    </MotionSpan>
                                )}
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>

                {installPromptEvent && (
                    <MotionButton
                        onClick={onInstallClick}
                        {...{ whileTap: { scale: 0.95 } }}
                        className="bg-primary-focus text-white font-bold px-3 py-1.5 rounded-lg hover:bg-primary transition-colors shadow-sm flex items-center text-sm"
                    >
                        {ICONS.install}
                        <span className="ml-2 hidden sm:inline">Install App</span>
                    </MotionButton>
                )}

                <div className="relative">
                    <MotionButton
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        {...{ whileTap: { scale: 0.95 } }}
                        className="text-foreground/70 hover:text-accent p-2 rounded-full hover:bg-black/5 dark:text-dark-foreground/70 dark:hover:text-dark-accent dark:hover:bg-white/5"
                        aria-label="Notifications"
                    >
                        {ICONS.bell}
                        {lowStockProducts.length > 0 && (
                            <MotionSpan 
                                {...{ initial: { scale: 0 }, animate: { scale: 1 } }}
                                className="absolute -top-1 -right-1 bg-danger text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center border-2 border-card dark:border-dark-card">
                                {lowStockProducts.length}
                            </MotionSpan>
                        )}
                    </MotionButton>
                     <AnimatePresence>
                        {isNotificationsOpen && (
                           <LowStockNotificationPopover
                                lowStockProducts={lowStockProducts}
                                onClose={() => setIsNotificationsOpen(false)}
                           />
                        )}
                    </AnimatePresence>
                </div>
                
                <div className="relative">
                    <MotionButton
                        onClick={activeTimeClockEvent ? onClockOut : onClockIn}
                        {...{ whileTap: { scale: 0.95 } }}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors shadow-sm text-sm font-bold ${
                            activeTimeClockEvent 
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                        }`}
                        aria-label={activeTimeClockEvent ? `Clock Out (Elapsed: ${elapsedTime})` : 'Clock In'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <AnimatePresence mode="wait">
                            {activeTimeClockEvent ? (
                                <MotionSpan key="clocked-in" {...{ initial: {opacity:0, width: 0}, animate: {opacity:1, width: 'auto'}, exit: {opacity:0, width: 0} }} className="hidden sm:inline font-mono">{elapsedTime}</MotionSpan>
                            ) : (
                                <MotionSpan key="clocked-out" {...{ initial: {opacity:0, width: 0}, animate: {opacity:1, width: 'auto'}, exit: {opacity:0, width: 0} }} className="hidden sm:inline">Clock In</MotionSpan>
                            )}
                        </AnimatePresence>
                    </MotionButton>
                </div>

                 <div className="relative">
                     <MotionButton 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                        {...{ whileTap: { scale: 0.95 } }}
                        className="flex items-center space-x-2 hover:bg-black/5 dark:hover:bg-white/5 p-1 pr-3 rounded-full transition-colors"
                     >
                        <div className="w-8 h-8 rounded-full bg-primary-focus dark:bg-dark-primary-focus text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                             <span>{userInitials}</span>
                        </div>
                        <div className="text-left hidden md:block">
                           <div className="font-bold text-sm text-foreground dark:text-dark-foreground">{currentUser.name}</div>
                           <div className="text-xs text-foreground/70 dark:text-dark-foreground/70">{currentUser.role}</div>
                        </div>
                         <MotionDiv {...{ animate: { rotate: isUserMenuOpen ? 180 : 0 } }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-foreground/70 dark:text-dark-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                         </MotionDiv>
                     </MotionButton>
                      <AnimatePresence>
                        {isUserMenuOpen && (
                           <MotionDiv
                             {...{
                                 initial: { opacity: 0, y: -10, scale: 0.95 },
                                 animate: { opacity: 1, y: 0, scale: 1 },
                                 exit: { opacity: 0, y: -10, scale: 0.95 }
                             }}
                             className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-20 border border-border dark:bg-dark-card dark:border-dark-border"
                           >
                            <a href="#" onClick={(e) => { e.preventDefault(); onToggleTheme(); }} className="flex items-center px-4 py-2 text-sm font-semibold text-foreground hover:bg-black/5 dark:text-dark-foreground/80 dark:hover:bg-white/10">
                                {theme === 'light' ? ICONS.moon : ICONS.sun}
                                <span className="ml-2">Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
                            </a>
                            <div className="my-1 h-px bg-border dark:bg-dark-border"></div>
                             <a href="#" onClick={handleLogout} className="flex items-center px-4 py-2 text-sm font-semibold text-foreground hover:bg-black/5 dark:text-dark-foreground/80 dark:hover:bg-white/10">
                                 {ICONS.logout}
                                 <span className="ml-2">Logout</span>
                            </a>
                           </MotionDiv>
                        )}
                    </AnimatePresence>
                 </div>
            </div>
        </header>
    );
};

export default Header;