'use client';
import React, { ReactNode, useState, ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View, Role, Permission } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
    currentView: View;
    setCurrentView: (view: View) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    role: Role;
    permissions: Permission[];
}

interface NavButtonProps {
    view: View;
    label: string;
    currentView: View;
    onClick: (view: View) => void;
    children: ReactNode;
    isSubItem?: boolean;
}

const MotionButton = motion.button;
const MotionDiv = motion.div;

const NavButton = ({ view, label, currentView, onClick, children, isSubItem = false }: NavButtonProps) => {
    const isActive = currentView === view;
    return (
        <MotionButton
            onClick={() => onClick(view)}
            className={`relative flex items-center w-full text-left rounded-lg transition-all duration-200 ease-in-out group font-medium ${ isSubItem ? 'pl-8 pr-3 py-2 text-sm' : 'p-3 text-base' } ${
                isActive
                    ? 'bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
        >
             {isActive && (
                <motion.div
                    className="absolute left-0 top-2 bottom-2 w-1 bg-primary dark:bg-dark-primary rounded-r-full"
                    {...{ layoutId: "active-nav-indicator" }}
                />
            )}
            <div className="flex-shrink-0 mr-3">
                {children}
            </div>
            <span>{label}</span>
        </MotionButton>
    );
};

const CollapsibleNavSection: React.FC<{ title: string, icon: ReactNode, isOpen: boolean, onToggle: () => void, isActive: boolean, children: ReactNode }> = ({ title, icon, isOpen, onToggle, isActive, children }) => {
    return (
        <div>
            <button
                onClick={onToggle}
                className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-all duration-200 ease-in-out group font-medium text-base ${
                    isActive ? 'bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            >
                <div className="flex items-center">
                    <div className="mr-3 flex-shrink-0">{icon}</div>
                    <span className="text-base">{title}</span>
                </div>
                 <motion.div {...{ animate: { rotate: isOpen ? 90 : 0 }, transition: { duration: 0.2 } }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        {...{
                            initial: { height: 0, opacity: 0 },
                            animate: { height: 'auto', opacity: 1 },
                            exit: { height: 0, opacity: 0 },
                            transition: { duration: 0.3, ease: 'easeInOut' }
                        }}
                        className="overflow-hidden mt-1 space-y-1"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const POS_NAV_ITEMS: { view: View; label: string; icon: ReactElement; permission: Permission }[] = [
    { view: View.POS, label: 'New Sale', icon: ICONS.pos, permission: 'view_pos' },
    { view: View.ReturnReceipt, label: 'Process Return', icon: ICONS.returnReceipt, permission: 'manage_returns' },
    { view: View.Payout, label: 'Payout', icon: ICONS.payout, permission: 'manage_payouts' },
    { view: View.SalesOrder, label: 'New Sales Order', icon: ICONS.salesOrder, permission: 'manage_sales_orders' },
    { view: View.Layaway, label: 'New Layaway', icon: ICONS.layaway, permission: 'manage_layaways' },
    { view: View.WorkOrder, label: 'New Work Order', icon: ICONS.workOrder, permission: 'manage_work_orders' },
    { view: View.SalesHistory, label: 'Sales History', icon: ICONS.salesHistory, permission: 'view_sales_history' },
    { view: View.HeldReceipts, label: 'Held Receipts', icon: ICONS.heldReceipts, permission: 'view_held_receipts' },
    { view: View.SalesOrderList, label: 'Sales Order List', icon: ICONS.salesOrder, permission: 'manage_sales_orders' },
    { view: View.LayawayList, label: 'Layaway List', icon: ICONS.layaway, permission: 'manage_layaways' },
    { view: View.WorkOrderList, label: 'Work Order List', icon: ICONS.workOrder, permission: 'manage_work_orders' },
    { view: View.OpenCashDrawer, label: 'Open Cash Drawer', icon: ICONS.openDrawer, permission: 'open_cash_drawer' },
    { view: View.ShiftReport, label: 'Z-Report', icon: ICONS.shiftReport, permission: 'view_shift_report' },
];

const MAIN_NAV_ITEMS: { view: View; label: string; icon: ReactElement; permission: Permission }[] = [
    { view: View.Dashboard, label: 'Dashboard', icon: ICONS.dashboard, permission: 'view_dashboard' },
    { view: View.Inventory, label: 'Inventory', icon: ICONS.inventory, permission: 'view_inventory' },
    { view: View.Purchases, label: 'Purchases', icon: ICONS.purchases, permission: 'view_purchases' },
    { view: View.Quotations, label: 'Quotes', icon: ICONS.quotations, permission: 'view_quotations' },
    { view: View.AccountsPayable, label: 'A/P', icon: ICONS.ap, permission: 'view_ap' },
    { view: View.TaxReports, label: 'Tax Reports', icon: ICONS.tax, permission: 'view_tax_reports' },
    { view: View.PaymentSummary, label: 'Payments', icon: ICONS.paymentSummary, permission: 'view_payment_summary' },
    { view: View.Customers, label: 'Customers', icon: ICONS.customers, permission: 'view_customers' },
    { view: View.Staff, label: 'Staff', icon: ICONS.staff, permission: 'view_staff' },
    { view: View.TimeSheets, label: 'Time Sheets', icon: ICONS.timeSheets, permission: 'view_timesheets' },
];


const SidebarContent = ({ currentView, setCurrentView, permissions }: Omit<SidebarProps, 'isOpen' | 'setIsOpen' | 'role'>) => {
    
    const [isPosOpen, setIsPosOpen] = useState(true);

    const visiblePosItems = POS_NAV_ITEMS.filter(item => permissions.includes(item.permission as Permission));
    const visibleMainItems = MAIN_NAV_ITEMS.filter(item => permissions.includes(item.permission as Permission));
    
    return (
        <div className="w-full md:w-64 bg-card dark:bg-dark-card flex flex-col h-full border-r border-slate-200/80 dark:border-slate-800/80 shadow-lg">
            <div className="flex items-center h-20 w-full flex-shrink-0 px-4 border-b border-slate-200/80 dark:border-slate-800/80">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary dark:text-dark-primary">
                    <motion.path d="M7 12L12 17L17 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...{ initial: { y: -2 }, animate: { y: 0 }, transition: { repeat: Infinity, repeatType: 'mirror', duration: 0.8, ease: "easeInOut" } }} />
                    <motion.path d="M7 7L12 12L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" {...{ initial: { y: 0 }, animate: { y: 2 }, transition: { repeat: Infinity, repeatType: 'mirror', duration: 0.8, ease: "easeInOut" } }}/>
                </svg>
                <h1 className="text-xl font-bold text-foreground dark:text-dark-foreground ml-2 hidden md:block">Banduka POS™</h1>
            </div>
            <nav className="w-full flex-grow p-4 flex flex-col space-y-2 overflow-y-auto">
                <CollapsibleNavSection
                    title="Point of Sale"
                    icon={ICONS.pos}
                    isOpen={isPosOpen}
                    onToggle={() => setIsPosOpen(!isPosOpen)}
                    isActive={visiblePosItems.some(item => item.view === currentView)}
                >
                    <div className="flex flex-col space-y-1 mt-1">
                        {visiblePosItems.map(item => (
                            <NavButton key={item.view} view={item.view} label={item.label} currentView={currentView} onClick={setCurrentView} isSubItem>
                                {React.cloneElement(item.icon as any, { className: 'h-5 w-5' })}
                            </NavButton>
                        ))}
                    </div>
                </CollapsibleNavSection>
                 
                 {visibleMainItems.map(item => (
                    <NavButton key={item.view} view={item.view} label={item.label} currentView={currentView} onClick={setCurrentView}>
                        {item.icon}
                    </NavButton>
                ))}
                 
            </nav>
            <div className="mt-auto p-4 border-t border-slate-200/80 dark:border-slate-800/80">
                 {permissions.includes('view_settings') && (
                    <NavButton view={View.Settings} label="Settings" currentView={currentView} onClick={setCurrentView}>
                        {ICONS.settings}
                    </NavButton>
                )}
            </div>
        </div>
    );
};


const Sidebar = ({ currentView, setCurrentView, isOpen, setIsOpen, role, permissions }: SidebarProps) => {
    
    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block flex-shrink-0">
                 <SidebarContent currentView={currentView} setCurrentView={setCurrentView} permissions={permissions} />
            </div>
            
            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <div className="md:hidden">
                        <motion.div
                            {...{
                                initial: { opacity: 0 },
                                animate: { opacity: 1 },
                                exit: { opacity: 0 },
                                transition: { duration: 0.3 }
                            }}
                            className="fixed inset-0 bg-black bg-opacity-50 z-30"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                             {...{
                                 initial: { x: '-100%' },
                                 animate: { x: 0 },
                                 exit: { x: '-100%' },
                                 transition: { type: 'spring', stiffness: 300, damping: 30 }
                             }}
                             className="fixed top-0 left-0 h-full z-40 w-64"
                        >
                            <SidebarContent currentView={currentView} setCurrentView={(v) => { setCurrentView(v); setIsOpen(false); }} permissions={permissions} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;