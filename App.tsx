'use client';
import React, { useState, useCallback, useEffect, useMemo, useRef, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Product, CartItem, Customer, Sale, View, Supplier, PurchaseOrder, SupplierInvoice, SupplierPayment, Role, User, SaleData, Settings, ToastData, AuditLog, Permission, Quotation, PurchaseOrderData, Shift, Payment, PurchaseOrderItem, ReceivedPOItem, TimeClockEvent, Payout, Layaway, WorkOrder, SalesOrder, HeldReceipt, SalesOrderItem, QuotationItem } from './types';
import { MOCK_CUSTOMERS, DEFAULT_SETTINGS } from './constants';
import { useThemeManager } from './hooks/useThemeManager';
import { useTheme } from './hooks/useTheme';
import * as db from './utils/offlineDb';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PosView from './components/PosView';
import DashboardView from './components/dashboardView';
import InventoryView from './components/InventoryView';
import PurchasesView from './components/PurchasesView';
import AccountsPayableView from './components/AccountsPayableView';
import TaxReportView from './components/TaxReportView';
import ShiftReportView from './components/ShiftReportView';
import SalesHistoryView from './components/salesHistory/SalesHistoryView';
import ReceiptDetailView from './components/salesHistory/ReceiptDetailView';
import SettingsView from './components/SettingsView';
import Toast from './components/common/Toast';
import CustomersView from './components/CustomersView';
import QuotationsView from './components/QuotationsView';
import StaffView from './components/StaffView';
import SignUpView from './components/SignUpView';
import LoginView from './components/LoginView';
import ConfirmationModal from './components/common/ConfirmationModal';
import ReceivePOModal from './components/purchases/ReceivePOModal';
import AddToPOModal from './components/modals/AddToPOModal';
import BarcodePrintModal from './components/inventory/BarcodePrintModal';
import CreateQuotationForm from './components/quotations/CreateQuotationForm';
import QuotationDetailView from './components/quotations/QuotationDetailView';
import InvoiceDetailView from './components/accountsPayable/InvoiceDetailView';
import EmailModal from './components/modals/EmailModal';
import WhatsAppModal from './components/modals/WhatsAppModal';
import SetupWizard from './components/setup/SetupWizard';
import UpdateNotification from './components/common/UpdateNotification';
import TimeSheetsView from './components/timesheets/TimeSheetsView';
import TimeClockModal from './components/timesheets/TimeClockModal';
import ReturnReceiptView from './components/pos/ReturnReceiptView';
import PayoutView from './components/pos/PayoutView';
import NewLayawayView from './components/layaway/NewLayawayView';
import LayawayListView from './components/layaway/LayawayListView';
import LayawayDetailView from './components/layaway/LayawayDetailView';
import NewWorkOrderView from './components/work_orders/NewWorkOrderView';
import WorkOrderListView from './components/work_orders/WorkOrderListView';
import WorkOrderDetailView from './components/work_orders/WorkOrderDetailView';
import NewSalesOrderView from './components/sales_orders/NewSalesOrderView';
import SalesOrderListView from './components/sales_orders/SalesOrderListView';
import SalesOrderDetailView from './components/sales_orders/SalesOrderDetailView';
import HoldReceiptModal from './components/modals/HoldReceiptModal';
import HeldReceiptsView from './components/HeldReceiptsView';
import PaymentSummaryView from './components/PaymentSummaryView';
import ForgotPasswordView from './components/ForgotPasswordView';
import PinLockView from './components/PinLockView';


const MotionDiv = motion.div;
const AnimatedView = ({ children }: { children: ReactNode }) => (
    <MotionDiv
      {...{
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
        transition: { duration: 0.2, ease: 'easeInOut' }
      }}
      className="absolute top-0 left-0 w-full h-full"
    >
      {children}
    </MotionDiv>
);

const PlaceholderView = ({ viewName }: { viewName: string }) => (
    <div className="flex items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 p-8 bg-background dark:bg-dark-background">
        <div className="flex flex-col items-center">
             <div className="bg-card dark:bg-dark-card p-4 rounded-full mb-4 border dark:border-dark-border">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary dark:text-dark-primary"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.15l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.15l.15-.08a2 2 0 0 0 .73 2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground dark:text-dark-foreground">{viewName}</h1>
            <p className="mt-2 max-w-md">This feature is under development. Our team is working hard to bring it to you soon. Stay tuned for updates!</p>
        </div>
    </div>
);


const App = () => {
    // --- Theming Hooks ---
    const { currentEvent } = useThemeManager();
    const [theme, toggleTheme] = useTheme();


    // --- App State ---
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentView, setCurrentView] = useState<View>(View.POS);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const [updateAvailable, setUpdateAvailable] = useState<ServiceWorkerRegistration | null>(null);
    const [installPromptEvent, setInstallPromptEvent] = useState<Event | null>(null);
    const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot_password'>('login');
    const [recoveryUser, setRecoveryUser] = useState<User | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const idleTimerRef = useRef<number | null>(null);

    // --- Data State ---
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>([]);
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [timeClockEvents, setTimeClockEvents] = useState<TimeClockEvent[]>([]);
    const [layaways, setLayaways] = useState<Layaway[]>([]);
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
    const [heldReceipts, setHeldReceipts] = useState<HeldReceipt[]>([]);
    
    // --- Component-specific state ---
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(MOCK_CUSTOMERS[0]?.id || '');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeShift, setActiveShift] = useState<Shift | null>(null);
    const [activeTimeClockEvent, setActiveTimeClockEvent] = useState<TimeClockEvent | null>(null);
    const [isEndingShift, setIsEndingShift] = useState(false);
    const [shiftReportToShow, setShiftReportToShow] = useState<Shift | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [poToReceive, setPoToReceive] = useState<PurchaseOrder | null>(null);
    const [productForPO, setProductForPO] = useState<Product | null>(null);
    const [productToPrintBarcode, setProductToPrintBarcode] = useState<Product | null>(null);
    const [isCreateQuoteModalOpen, setIsCreateQuoteModalOpen] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
    const [originatingQuoteId, setOriginatingQuoteId] = useState<string | null>(null);
    const [originatingSalesOrderId, setOriginatingSalesOrderId] = useState<string | null>(null);
    const [originatingWorkOrderId, setOriginatingWorkOrderId] = useState<string | null>(null);
    const [invoiceToView, setInvoiceToView] = useState<SupplierInvoice | null>(null);
    const [saleToView, setSaleToView] = useState<Sale | null>(null);
    const [selectedSalesOrder, setSelectedSalesOrder] = useState<SalesOrder | null>(null);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
    const [selectedLayaway, setSelectedLayaway] = useState<Layaway | null>(null);
    const [emailInfo, setEmailInfo] = useState<{ documentType: 'Receipt' | 'Quotation' | 'Proforma-Invoice' | 'SupplierInvoice' | 'PurchaseOrder', documentId: string, recipientId: string } | null>(null);
    const [whatsAppInfo, setWhatsAppInfo] = useState<{ mode: 'receipt' | 'bulk' | 'po', customerId?: string, documentId?: string, supplierId?: string } | null>(null);
    const [timeClockEventToEdit, setTimeClockEventToEdit] = useState<TimeClockEvent | null>(null);
    const [isCashDrawerModalOpen, setIsCashDrawerModalOpen] = useState(false);
    const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
    const [receiptToDelete, setReceiptToDelete] = useState<HeldReceipt | null>(null);
    const [viewBeforeModal, setViewBeforeModal] = useState<View>(View.POS);
    const [settingsModalToShow, setSettingsModalToShow] = useState<string | null>(null);
    const [isFactoryResetModalOpen, setIsFactoryResetModalOpen] = useState(false);
    const restoreInputRef = useRef<HTMLInputElement>(null);
    const previousViewRef = useRef<View | null>(null);

    useEffect(() => {
        previousViewRef.current = currentView;
    });


    // --- Offline Management ---
    const [isOnline, setIsOnline] = useState(true);


    // --- Utility Functions ---
    const showToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
        const newToast: ToastData = { id: Date.now(), message, type };
        setToasts(prev => [...prev, newToast]);
        setTimeout(() => {
            setToasts(currentToasts => currentToasts.filter(t => t.id !== newToast.id));
        }, 3000);
    }, []);

    const addAuditLog = useCallback(async (action: string, details: string) => {
        if (!currentUser) return;
        try {
            const newLog: AuditLog = {
                id: `log_${Date.now()}`,
                timestamp: new Date(),
                userId: currentUser.id,
                userName: currentUser.name,
                action,
                details
            };
            await db.saveItem('auditLogs', newLog);
            setAuditLogs(prev => [newLog, ...prev].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        } catch (error) {
            console.error("Failed to add audit log:", error);
        }
    }, [currentUser]);

    // --- Idle timer for PIN lock screen ---
    const resetIdleTimer = useCallback(() => {
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }
        // Set to 5 minutes (300,000 milliseconds)
        idleTimerRef.current = window.setTimeout(() => {
            setIsLocked(true);
        }, 300000); 
    }, []);

    useEffect(() => {
        if (isAuthenticated && !isLocked) {
            const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
            events.forEach(event => window.addEventListener(event, resetIdleTimer));
            resetIdleTimer();

            return () => {
                events.forEach(event => window.removeEventListener(event, resetIdleTimer));
                if (idleTimerRef.current) {
                    clearTimeout(idleTimerRef.current);
                }
            };
        }
    }, [isAuthenticated, isLocked, resetIdleTimer]);
    
    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPromptEvent(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);
    
    // --- Main App Initialization ---
    const fetchAllData = async () => {
        try {
            const [
                dbProducts, dbCustomers, dbSales, dbSuppliers,
                dbPurchaseOrders, dbSupplierInvoices, dbQuotations,
                dbUsers, dbSettings, dbAuditLogs, dbShifts,
                dbTimeClockEvents, dbPayouts, dbLayaways, dbWorkOrders, dbSalesOrders, dbHeldReceipts
            ] = await Promise.all([
                db.getAllItems<Product>('products'),
                db.getAllItems<Customer>('customers'),
                db.getAllItems<Sale>('sales'),
                db.getAllItems<Supplier>('suppliers'),
                db.getAllItems<PurchaseOrder>('purchaseOrders'),
                db.getAllItems<SupplierInvoice>('supplierInvoices'),
                db.getAllItems<Quotation>('quotations'),
                db.getAllItems<User>('users'),
                db.getItem<Settings>('settings', 'kenpos_settings'),
                db.getAllItems<AuditLog>('auditLogs'),
                db.getAllItems<Shift>('shifts'),
                db.getAllItems<TimeClockEvent>('timeClockEvents'),
                db.getAllItems<Payout>('payouts'),
                db.getAllItems<Layaway>('layaways'),
                db.getAllItems<WorkOrder>('workOrders'),
                db.getAllItems<SalesOrder>('salesOrders'),
                db.getAllItems<HeldReceipt>('heldReceipts'),
            ]);

            setProducts(dbProducts);
            setCustomers(dbCustomers.length > 0 ? dbCustomers : MOCK_CUSTOMERS);
            setSales(dbSales);
            setSuppliers(dbSuppliers);
            setPurchaseOrders(dbPurchaseOrders);
            setSupplierInvoices(dbSupplierInvoices);
            setQuotations(dbQuotations);
            setUsers(dbUsers);
            setAuditLogs(dbAuditLogs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            setShifts(dbShifts);
            setPayouts(dbPayouts);
            setTimeClockEvents(dbTimeClockEvents);
            setLayaways(dbLayaways);
            setWorkOrders(dbWorkOrders);
            setSalesOrders(dbSalesOrders);
            setHeldReceipts(dbHeldReceipts.sort((a,b) => new Date(b.heldAt).getTime() - new Date(a.heldAt).getTime()));
            
            if (dbSettings) {
                setSettings(dbSettings);
            } else {
                await db.saveItem('settings', DEFAULT_SETTINGS);
                setSettings(DEFAULT_SETTINGS);
            }

        } catch (error: any) {
            showToast(`Failed to load application data: ${error.message}`, 'error');
        }
    };


    useEffect(() => {
        setIsOnline(navigator.onLine);

        const checkAuthAndInitialize = async () => {
            await db.initDB();
            const token = localStorage.getItem('kenpos_token');
            const userId = localStorage.getItem('kenpos_userid');
            if (token && userId) {
                try {
                    const user = await db.getItem<User>('users', userId);
                    if (user) {
                        setCurrentUser(user);
                        setIsAuthenticated(true);
                        await fetchAllData();
                    } else {
                         throw new Error("User not found in local database.");
                    }
                } catch (error) {
                    localStorage.removeItem('kenpos_token');
                    localStorage.removeItem('kenpos_userid');
                    showToast('Your session is invalid. Please log in again.', 'info');
                }
            }
            setIsAppLoading(false);
        };

        checkAuthAndInitialize();
        
        const registerServiceWorker = () => {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(registration => {
              console.log('SW registered: ', registration);
              registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker) {
                  installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                      console.log('New SW is installed and waiting.');
                      const event = new CustomEvent('swUpdate', { detail: registration });
                      window.dispatchEvent(event);
                    }
                  };
                }
              };
            }).catch(registrationError => {
              console.log('SW registration failed: ', registrationError);
            });
          }
        };

        window.addEventListener('load', registerServiceWorker);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        const handleSwUpdate = (e: Event) => {
            const registration = (e as CustomEvent).detail;
            setUpdateAvailable(registration);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('swUpdate', handleSwUpdate);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('swUpdate', handleSwUpdate);
        };
    }, [showToast]);
    
    // --- Core Business Logic Handlers ---

    const handleAppUpdate = () => {
        if (updateAvailable && updateAvailable.waiting) {
            updateAvailable.waiting.postMessage({ type: 'SKIP_WAITING' });
            let refreshing;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                window.location.reload();
                refreshing = true;
            });
        }
    };
    
    const handleInstallClick = async () => {
        if (!installPromptEvent) {
            return;
        }
        (installPromptEvent as any).prompt();
        const { outcome } = await (installPromptEvent as any).userChoice;
        if (outcome === 'accepted') {
            showToast('App installed successfully!', 'success');
        }
        setInstallPromptEvent(null);
    };

    // Auth & User Management
    const handleSignUp = async (userData: Omit<User, 'id' | 'role'>): Promise<boolean> => {
        try {
            const allUsers = await db.getAllItems<User>('users');
            const existingUser = allUsers.find(u => u.email === userData.email);
            if (existingUser) {
                showToast('An account with this email already exists.', 'error');
                return false;
            }

            const newUser: User = {
                id: `user_${Date.now()}`,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: allUsers.length === 0 ? 'Admin' : 'Cashier',
            };
            
            const token = `mock_token_${Date.now()}`;
            await db.saveItem('users', newUser);
            setUsers(prev => [...prev, newUser]);

            localStorage.setItem('kenpos_token', token);
            localStorage.setItem('kenpos_userid', newUser.id);
            setCurrentUser(newUser);
            setIsAuthenticated(true);
            await fetchAllData();
            showToast(`Welcome, ${newUser.name}! Your account is ready.`, 'success');
            return true;
        } catch (error: any) {
            showToast(error.message, 'error');
            return false;
        }
    };

    const handleLogin = async (email: string, password: string): Promise<boolean> => {
        try {
            const allUsers = await db.getAllItems<User>('users');
            const user = allUsers.find(u => u.email === email && u.password === password);

            if (!user) {
                 const existingUser = allUsers.find(u => u.email === email);
                 if (!existingUser) {
                     showToast('No account found with this email.', 'error');
                 } else {
                     showToast('Invalid password.', 'error');
                 }
                return false;
            }

            const token = `mock_token_${Date.now()}`;
            localStorage.setItem('kenpos_token', token);
            localStorage.setItem('kenpos_userid', user.id);
            setCurrentUser(user);
            setIsAuthenticated(true);
            await fetchAllData();
            showToast(`Welcome, ${user.name}!`, 'success');
            return true;
        } catch (error: any) {
            showToast(error.message, 'error');
            return false;
        }
    };

    const handleLogout = () => {
        if (activeShift) {
            showToast("Cannot log out during an active shift. Please end your shift first.", "error");
            return;
        }
        localStorage.removeItem('kenpos_token');
        localStorage.removeItem('kenpos_userid');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setProducts([]); setCustomers([]); setSales([]); setSuppliers([]);
        setPurchaseOrders([]); setSupplierInvoices([]); setQuotations([]);
        setUsers([]); setShifts([]); setPayouts([]); setTimeClockEvents([]);
        setLayaways([]); setWorkOrders([]); setSalesOrders([]); setHeldReceipts([]);
        setSettings(DEFAULT_SETTINGS);
        setCurrentView(View.POS);
        setIsLocked(false);
    };

    const handleFindUserForRecovery = async (email: string): Promise<User | null> => {
        try {
            const allUsers = await db.getAllItems<User>('users');
            const user = allUsers.find(u => u.email === email);
            if (user) {
                setRecoveryUser(user);
                return user;
            }
            showToast('No user found with that email address.', 'error');
            return null;
        } catch (error: any) {
             showToast(error.message, 'error');
            return null;
        }
    };

    const handleResetPassword = async (password: string) => {
        if (!recoveryUser) {
            showToast('An error occurred during password reset.', 'error');
            return;
        }
        try {
            const updatedUser = { ...recoveryUser, password };
            await db.saveItem('users', updatedUser);
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            setRecoveryUser(null);
            setAuthView('login');
            showToast('Password reset successfully! Please log in with your new password.', 'success');
        } catch (error: any) {
             showToast(error.message, 'error');
        }
    };


    // Find active shift for current user on load or user change
    useEffect(() => {
        if (currentUser) {
            const foundShift = shifts.find(s => s.userId === currentUser.id && s.status === 'active');
            setActiveShift(foundShift || null);
        } else {
            setActiveShift(null);
        }
    }, [currentUser, shifts]);

    // Clock In/Out Management
    useEffect(() => {
        if (currentUser) {
            const activeEvent = timeClockEvents.find(
                e => e.userId === currentUser.id && e.status === 'clocked-in'
            );
            setActiveTimeClockEvent(activeEvent || null);
        } else {
            setActiveTimeClockEvent(null);
        }
    }, [currentUser, timeClockEvents]);

    const handleClockIn = async () => {
        if (activeTimeClockEvent || !currentUser) return;
        try {
            const newEvent: TimeClockEvent = {
                id: `tce_${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                clockInTime: new Date(),
                status: 'clocked-in'
            };
            await db.saveItem('timeClockEvents', newEvent);
            setTimeClockEvents(prev => [newEvent, ...prev]);
            showToast('Successfully clocked in!', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    const handleClockOut = async () => {
        if (!activeTimeClockEvent || !currentUser) return;
        try {
            const updatedEventData: TimeClockEvent = {
                ...activeTimeClockEvent,
                clockOutTime: new Date(),
                status: 'clocked-out',
            };
            await db.saveItem('timeClockEvents', updatedEventData);
            setTimeClockEvents(prev => prev.map(e => e.id === updatedEventData.id ? updatedEventData : e));
            showToast('Successfully clocked out!', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    const handleSaveTimeClockEvent = async (eventData: TimeClockEvent) => {
        try {
            await db.saveItem('timeClockEvents', eventData);
            setTimeClockEvents(prev => {
                const exists = prev.some(e => e.id === eventData.id);
                return exists
                    ? prev.map(e => e.id === eventData.id ? eventData : e)
                    : [eventData, ...prev];
            });
            showToast('Time clock entry saved!', 'success');
            setTimeClockEventToEdit(null);
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    const handleDeleteTimeClockEvent = async (eventId: string) => {
        try {
            await db.deleteItem('timeClockEvents', eventId);
            setTimeClockEvents(prev => prev.filter(e => e.id !== eventId));
            showToast('Time clock entry deleted!', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    }

    
    // Persist cart to IndexedDB whenever it changes for session persistence
    useEffect(() => {
        db.saveAllItems('cart', cart);
    }, [cart]);
    
    // Prevent user from accessing unauthorized views
    useEffect(() => {
        if (!currentUser) return;
        const userPermissions = settings.permissions[currentUser.role];
        const viewPermissionMap: Record<string, Permission | undefined> = {
            [View.POS]: 'view_pos',
            [View.ReturnReceipt]: 'manage_returns',
            [View.Payout]: 'manage_payouts',
            [View.SalesOrder]: 'manage_sales_orders',
            [View.Layaway]: 'manage_layaways',
            [View.WorkOrder]: 'manage_work_orders',
            [View.HeldReceipts]: 'view_held_receipts',
            [View.SalesOrderList]: 'manage_sales_orders',
            [View.LayawayList]: 'manage_layaways',
            [View.WorkOrderList]: 'manage_work_orders',
            [View.OpenCashDrawer]: 'open_cash_drawer',
            [View.Dashboard]: 'view_dashboard',
            [View.Inventory]: 'view_inventory',
            [View.Purchases]: 'view_purchases',
            [View.AccountsPayable]: 'view_ap',
            [View.TaxReports]: 'view_tax_reports',
            [View.PaymentSummary]: 'view_payment_summary',
            [View.ShiftReport]: 'view_shift_report',
            [View.SalesHistory]: 'view_sales_history',
            [View.Customers]: 'view_customers',
            [View.Quotations]: 'view_quotations',
            [View.Staff]: 'view_staff',
            [View.TimeSheets]: 'view_timesheets',
            [View.Settings]: 'view_settings',
        };
        const requiredPermission = viewPermissionMap[currentView];
        if (requiredPermission && !userPermissions.includes(requiredPermission)) {
            showToast("You don't have permission to access this view.", "error");
            setCurrentView(View.POS); // Redirect to a safe default
        }
    }, [currentUser, currentView, settings.permissions, showToast]);
    
     // Reset detail views when switching main views
    useEffect(() => {
        setSelectedQuotation(null);
        setInvoiceToView(null);
        setSaleToView(null);
        setSelectedSalesOrder(null);
        setSelectedWorkOrder(null);
        setSelectedLayaway(null);
        if (currentView !== View.POS) {
            setOriginatingQuoteId(null);
            setOriginatingSalesOrderId(null);
            setOriginatingWorkOrderId(null);
        }
    }, [currentView]);

     // Handle Open Cash Drawer action
    useEffect(() => {
        if (currentView === View.OpenCashDrawer) {
            setViewBeforeModal(previousViewRef.current || View.POS); // remember where we were
            setIsCashDrawerModalOpen(true);
        } else {
            setIsCashDrawerModalOpen(false);
        }
    }, [currentView]);

    const handleOpenCashDrawer = () => {
        showToast('Cash drawer opened.', 'info');
        addAuditLog('OPEN_CASH_DRAWER', 'Cash drawer opened manually.');
        setIsCashDrawerModalOpen(false);
        setCurrentView(viewBeforeModal); // go back to previous view
    };


    // Cart Management
    const addToCart = useCallback((product: Product) => {
        if (product.stock <= 0 && product.productType === 'Inventory') {
            showToast(`${product.name} is out of stock.`, 'error');
            return;
        }
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                if (product.productType === 'Inventory' && existingItem.quantity >= product.stock) {
                    showToast(`No more stock available for ${product.name}.`, 'error');
                    return prevCart;
                }
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    }, [showToast]);

    const updateCartItemQuantity = useCallback((productId: string, quantity: number) => {
        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(item => item.id !== productId);
            }
            return prevCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            );
        });
    }, []);
    
    const removeFromCart = useCallback((productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        setOriginatingQuoteId(null);
        setOriginatingSalesOrderId(null);
        setOriginatingWorkOrderId(null);
    }, []);

    // Sale Completion
    const completeSale = useCallback(async (saleData: SaleData): Promise<Sale> => {
        if (!activeShift || !currentUser) {
            showToast("Cannot complete sale. No active shift.", "error");
            throw new Error("Cannot complete sale without an active shift or user.");
        }
        
        try {
            const newSaleId = `${settings.receipt.invoicePrefix}${Date.now()}`;
            const newSale: Sale = {
                ...saleData,
                id: newSaleId,
                type: 'Sale',
                synced: isOnline,
                cashierId: currentUser.id,
                cashierName: currentUser.name,
                shiftId: activeShift.id,
                pointsEarned: 0, // Simplified, would require more logic
                pointsBalanceAfter: 0, // Simplified
            };

            // Update product stock
            const updatedProducts = [...products];
            for (const item of newSale.items) {
                if (item.productType === 'Inventory') {
                    const productIndex = updatedProducts.findIndex(p => p.id === item.id);
                    if (productIndex !== -1) {
                        const newStock = updatedProducts[productIndex].stock - item.quantity;
                        updatedProducts[productIndex] = { ...updatedProducts[productIndex], stock: newStock };
                        await db.saveItem('products', updatedProducts[productIndex]);
                    }
                }
            }
            setProducts(updatedProducts);
            
            // Update customer loyalty points
            // This would require fetching the customer, updating points, and saving back. Skipped for brevity.

            // Save sale and update shift
            await db.saveItem('sales', newSale);
            const updatedShift: Shift = { ...activeShift, salesIds: [...activeShift.salesIds, newSale.id] };
            await db.saveItem('shifts', updatedShift);
            
            setSales(prev => [newSale, ...prev]);
            setActiveShift(updatedShift);
            setShifts(prev => prev.map(s => s.id === updatedShift.id ? updatedShift : s));
            
            if (originatingSalesOrderId) {
                const so = salesOrders.find(s => s.id === originatingSalesOrderId);
                if (so) {
                    const updatedSO = { ...so, status: 'Completed' as const };
                    await db.saveItem('salesOrders', updatedSO);
                    setSalesOrders(prev => prev.map(s => s.id === updatedSO.id ? updatedSO : s));
                }
            }
            if (originatingWorkOrderId) {
                 const wo = workOrders.find(w => w.id === originatingWorkOrderId);
                 if (wo) {
                     const updatedWO = { ...wo, status: 'Completed' as const, completedDate: new Date() };
                     await db.saveItem('workOrders', updatedWO);
                     setWorkOrders(prev => prev.map(w => w.id === updatedWO.id ? updatedWO : w));
                 }
            }

            clearCart();
            return newSale;

        } catch (error: any) {
            showToast(error.message, 'error');
            throw error;
        }
    }, [clearCart, isOnline, currentUser, settings, activeShift, products, salesOrders, workOrders]);

    const handleProcessReturn = useCallback(async (originalSale: Sale, returnedItems: CartItem[], reason: string, refundMethod: 'Cash' | 'Card' | 'M-Pesa') => {
        if (!activeShift || !currentUser) {
            showToast("Cannot process return. No active shift.", "error");
            return;
        }

        try {
            // Simplified return logic for local DB
            const totalRefund = returnedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const newReturnSale: Sale = {
                id: `RET-${originalSale.id}-${Date.now()}`,
                items: returnedItems.map(i => ({...i, quantity: -i.quantity})),
                subtotal: -totalRefund,
                discountAmount: 0,
                tax: 0, // Simplified tax handling for returns
                total: -totalRefund,
                payments: [{ method: refundMethod, amount: -totalRefund }],
                change: 0,
                customerId: originalSale.customerId,
                date: new Date(),
                synced: isOnline,
                cashierId: currentUser.id,
                cashierName: currentUser.name,
                shiftId: activeShift.id,
                pointsEarned: 0,
                pointsUsed: 0,
                pointsValue: 0,
                pointsBalanceAfter: 0,
                type: 'Return',
                originalSaleId: originalSale.id,
                returnReason: reason,
            };
            
            await db.saveItem('sales', newReturnSale);
            setSales(prev => [newReturnSale, ...prev]);

            // Update stock
            const updatedProducts = [...products];
            for (const item of returnedItems) {
                if (item.productType === 'Inventory') {
                    const productIndex = updatedProducts.findIndex(p => p.id === item.id);
                    if (productIndex !== -1) {
                        const newStock = updatedProducts[productIndex].stock + item.quantity;
                        updatedProducts[productIndex] = { ...updatedProducts[productIndex], stock: newStock };
                        await db.saveItem('products', updatedProducts[productIndex]);
                    }
                }
            }
            setProducts(updatedProducts);

            showToast('Return processed successfully.', 'success');
            setCurrentView(View.POS);
        } catch (error: any) {
             showToast(error.message, 'error');
        }
    }, [activeShift, currentUser, showToast, isOnline, products]);

    const handleProcessPayout = useCallback(async (amount: number, reason: string, payee?: string) => {
        if (!activeShift || !currentUser) {
            showToast("Cannot process payout. No active shift.", "error");
            return;
        }

        try {
            const newPayout: Payout = {
                id: `payout_${Date.now()}`,
                shiftId: activeShift.id,
                cashierId: currentUser.id,
                cashierName: currentUser.name,
                date: new Date(),
                amount,
                reason,
                payee,
            };
            await db.saveItem('payouts', newPayout);
            setPayouts(prev => [newPayout, ...prev]);
            
            const updatedShift = { ...activeShift, payoutIds: [...(activeShift.payoutIds || []), newPayout.id] };
            await db.saveItem('shifts', updatedShift);
            setActiveShift(updatedShift);
            setShifts(prev => prev.map(s => s.id === updatedShift.id ? updatedShift : s));

            showToast('Payout recorded successfully.', 'success');
            setCurrentView(View.POS);
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    }, [activeShift, currentUser, showToast]);

    const handleAddLayaway = useCallback(async (layawayData: Omit<Layaway, 'id' | 'balance' | 'cashierId' | 'cashierName' | 'shiftId'>) => {
       if (!activeShift || !currentUser) {
            showToast("Cannot create layaway. No active shift.", "error");
            return;
        }
        try {
            const newLayaway: Layaway = {
                ...layawayData,
                id: `${settings.receipt.layawayPrefix}${Date.now()}`,
                balance: layawayData.total - layawayData.deposit,
                cashierId: currentUser.id,
                cashierName: currentUser.name,
                shiftId: activeShift.id,
            };
            await db.saveItem('layaways', newLayaway);
            setLayaways(prev => [newLayaway, ...prev]);
            
            // Update stock
            const updatedProducts = [...products];
            for (const item of newLayaway.items) {
                 if (item.productType === 'Inventory') {
                    const productIndex = updatedProducts.findIndex(p => p.id === item.id);
                    if (productIndex !== -1) {
                        const newStock = updatedProducts[productIndex].stock - item.quantity;
                        updatedProducts[productIndex] = { ...updatedProducts[productIndex], stock: newStock };
                        await db.saveItem('products', updatedProducts[productIndex]);
                    }
                }
            }
            setProducts(updatedProducts);

            showToast('Layaway created successfully!', 'success');
            setCurrentView(View.LayawayList);
        } catch (error: any) {
             showToast(error.message, 'error');
        }

    }, [activeShift, currentUser, showToast, settings.receipt.layawayPrefix, products]);
    
    const handleAddLayawayPayment = useCallback(async (layawayId: string, amount: number, method: 'Cash' | 'M-Pesa' | 'Card') => {
        const layaway = layaways.find(l => l.id === layawayId);
        if (!layaway || !currentUser) return;

        try {
            const updatedLayaway: Layaway = {
                ...layaway,
                payments: [...layaway.payments, { date: new Date(), amount, method, cashierId: currentUser.id }],
                balance: layaway.balance - amount,
            };
            if (updatedLayaway.balance <= 0) {
                updatedLayaway.status = 'Completed';
            }
            await db.saveItem('layaways', updatedLayaway);
            setLayaways(prev => prev.map(l => l.id === updatedLayaway.id ? updatedLayaway : l));
            setSelectedLayaway(updatedLayaway);
            showToast('Payment recorded successfully!');
        } catch (error: any) {
             showToast(error.message, 'error');
        }
    }, [layaways, currentUser, showToast]);


    const handleAddWorkOrder = useCallback(async (workOrderData: Omit<WorkOrder, 'id' | 'cashierId' | 'cashierName' | 'shiftId'>) => {
        if (!activeShift || !currentUser) {
            showToast("Cannot create work order. No active shift.", "error");
            return;
        }
        try {
            const newWorkOrder: WorkOrder = {
                ...workOrderData,
                id: `${settings.receipt.workOrderPrefix}${Date.now()}`,
                cashierId: currentUser.id,
                cashierName: currentUser.name,
                shiftId: activeShift.id,
            };
            await db.saveItem('workOrders', newWorkOrder);
            setWorkOrders(prev => [newWorkOrder, ...prev]);
            showToast('Work order created successfully!', 'success');
            setCurrentView(View.WorkOrderList);
        } catch (error: any) {
             showToast(error.message, 'error');
        }
    }, [activeShift, currentUser, showToast, settings.receipt.workOrderPrefix]);

    const handleUpdateWorkOrder = useCallback(async (updatedWorkOrder: WorkOrder) => {
        try {
            await db.saveItem('workOrders', updatedWorkOrder);
            setWorkOrders(prev => prev.map(wo => wo.id === updatedWorkOrder.id ? updatedWorkOrder : wo));
            setSelectedWorkOrder(updatedWorkOrder); // Keep the view updated
            showToast('Work order updated successfully!');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    }, [showToast]);

    const handlePushWorkOrderToPOS = useCallback((workOrder: WorkOrder) => {
        if (!activeShift) {
            showToast('Please start a shift before completing a work order.', 'error');
            return;
        }
        if (cart.length > 0) {
            showToast('Please clear the current cart before loading a work order.', 'error');
            return;
        }
    
        const balanceDue = workOrder.estimatedCost - workOrder.depositPaid;
        if (balanceDue <= 0 && workOrder.status !== 'Completed') {
            showToast('This work order has no balance due and can be marked as completed directly.', 'info');
            handleUpdateWorkOrder({ ...workOrder, status: 'Completed', completedDate: new Date() });
            return;
        }

        const workOrderServiceItem: CartItem = {
            id: `service_wo_${workOrder.id}`,
            name: `Service: ${workOrder.itemToService}`,
            sku: `WO-${workOrder.id}`,
            description: workOrder.descriptionOfWork,
            category: 'Services',
            price: workOrder.estimatedCost, 
            pricingType: 'inclusive',
            productType: 'Service',
            costPrice: 0,
            stock: 9999,
            imageUrl: '',
            quantity: 1,
            unitOfMeasure: 'job',
        };

        setCart([workOrderServiceItem]);
        setSelectedCustomerId(workOrder.customerId);
        setOriginatingWorkOrderId(workOrder.id);
        setCurrentView(View.POS);
        
        showToast(`Work Order ${workOrder.id} loaded into POS for payment.`, 'info');

    }, [activeShift, cart, showToast, handleUpdateWorkOrder]);

    const handleAddSalesOrder = useCallback(async (salesOrderData: Omit<SalesOrder, 'id' | 'balance' | 'cashierId' | 'cashierName' | 'shiftId'>) => {
        if (!activeShift || !currentUser) {
            showToast("Cannot create sales order. No active shift.", "error");
            return;
        }
        try {
            const newSalesOrder: SalesOrder = {
                ...salesOrderData,
                id: `${settings.receipt.salesOrderPrefix}${Date.now()}`,
                balance: salesOrderData.total - salesOrderData.deposit,
                cashierId: currentUser.id,
                cashierName: currentUser.name,
                shiftId: activeShift.id,
            };
            await db.saveItem('salesOrders', newSalesOrder);
            setSalesOrders(prev => [newSalesOrder, ...prev]);
            showToast('Sales order created successfully!', 'success');
            setCurrentView(View.SalesOrderList);
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    }, [activeShift, currentUser, showToast, settings.receipt.salesOrderPrefix]);

    const handleHoldReceipt = useCallback(async (name: string) => {
        if (!cart.length || !currentUser) return;
        try {
            const newHeldReceipt: HeldReceipt = {
                id: `held_${Date.now()}`,
                name: name.trim() || `Receipt @ ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
                items: cart,
                customerId: selectedCustomerId,
                heldAt: new Date(),
                cashierId: currentUser.id,
                cashierName: currentUser.name,
            };
            await db.saveItem('heldReceipts', newHeldReceipt);
            setHeldReceipts(prev => [newHeldReceipt, ...prev].sort((a,b) => new Date(b.heldAt).getTime() - new Date(a.heldAt).getTime()));
            clearCart();
            setIsHoldModalOpen(false);
            showToast('Receipt has been held.', 'success');
        } catch (error: any) {
             showToast(error.message, 'error');
        }
    }, [cart, selectedCustomerId, currentUser, clearCart, showToast]);

    const handleRecallReceipt = useCallback(async (receipt: HeldReceipt) => {
        if(cart.length > 0) {
            showToast('Please clear or complete the current sale before recalling another.', 'error');
            return;
        }
        setCart(receipt.items);
        setSelectedCustomerId(receipt.customerId);
        try {
            await db.deleteItem('heldReceipts', receipt.id);
            setHeldReceipts(prev => prev.filter(r => r.id !== receipt.id));
            setCurrentView(View.POS);
            showToast(`Recalled receipt: ${receipt.name}`, 'info');
        } catch(error: any) {
             showToast(error.message, 'error');
             setCart([]);
        }
    }, [cart, showToast]);

    const handleDeleteHeldReceipt = useCallback(async () => {
        if (!receiptToDelete) return;
        try {
            await db.deleteItem('heldReceipts', receiptToDelete.id);
            setHeldReceipts(prev => prev.filter(r => r.id !== receiptToDelete.id));
            showToast('Held receipt deleted.', 'success');
            setReceiptToDelete(null);
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    }, [receiptToDelete, showToast]);


    // Shift Management
    const handleStartShift = async (startingFloat: number) => {
        if (activeShift || !currentUser) {
            showToast("A shift is already active or user not logged in.", 'error');
            return;
        }
        try {
            const newShift: Shift = {
                id: `shift_${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                startTime: new Date(),
                status: 'active',
                startingFloat,
                salesIds: [],
                payoutIds: [],
            };
            await db.saveItem('shifts', newShift);
            setShifts(prev => [...prev, newShift]);
            setActiveShift(newShift);
            showToast("Shift started successfully.", 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    const handleEndShift = async (actualCashInDrawer: number) => {
        if (!activeShift) {
            showToast("No active shift to end.", 'error');
            return;
        }

        try {
            // Recalculate totals on close to ensure data integrity
            const shiftSales = sales.filter(s => activeShift.salesIds.includes(s.id));
            const paymentBreakdown: { [key in Payment['method']]?: number } = {};
            let cashChange = 0;

            shiftSales.forEach(sale => {
                sale.payments.forEach(p => {
                    paymentBreakdown[p.method] = (paymentBreakdown[p.method] || 0) + p.amount;
                });
                cashChange += sale.change;
            });
            const totalSales = Object.values(paymentBreakdown).reduce((sum, amount) => sum + (amount || 0), 0);
            const totalPayouts = payouts.filter(p => activeShift.payoutIds?.includes(p.id)).reduce((sum, p) => sum + p.amount, 0);
            const expectedCashInDrawer = activeShift.startingFloat + (paymentBreakdown['Cash'] || 0) - cashChange - totalPayouts;
            const cashVariance = actualCashInDrawer - expectedCashInDrawer;

            const closedShift: Shift = {
                ...activeShift,
                status: 'closed',
                endTime: new Date(),
                actualCashInDrawer,
                paymentBreakdown,
                totalSales,
                totalPayouts,
                expectedCashInDrawer,
                cashVariance,
            };

            await db.saveItem('shifts', closedShift);
            setShifts(prev => prev.map(s => s.id === closedShift.id ? closedShift : s));
            setActiveShift(null);
            setIsEndingShift(false);
            setShiftReportToShow(closedShift);
            showToast("Shift closed successfully.", 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    // Settings & User Admin
    const updateSettings = async (newSettings: Partial<Settings>) => {
        try {
            const updatedSettings: Settings = { ...settings, ...newSettings, id: 'kenpos_settings' };
            await db.saveItem('settings', updatedSettings);
            setSettings(updatedSettings);
            showToast('Settings saved successfully!');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };
    
    const addUser = async (user: Omit<User, 'id'>) => {
        try {
            const newUser: User = { ...user, id: `user_${Date.now()}` };
            await db.saveItem('users', newUser);
            setUsers(prev => [...prev, newUser]);
            showToast('User added successfully!');
        } catch (error: any) {
             showToast(error.message, 'error');
        }
    };
    
    const updateUser = async (updatedUser: User) => {
        try {
            await db.saveItem('users', updatedUser);
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            showToast('User updated successfully!');
        } catch (error: any) {
             showToast(error.message, 'error');
        }
    };

    const deleteUser = async (userId: string) => {
        if (userId === currentUser?.id) {
            showToast('Cannot delete the currently logged-in user.', 'error');
            return;
        }
        try {
            await db.deleteItem('users', userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            showToast('User deleted successfully!');
        } catch (error: any) {
             showToast(error.message, 'error');
        }
    };

    // Product Management
    const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'stock'>): Promise<Product> => {
        try {
            const newProduct: Product = { ...productData, id: `prod_${Date.now()}`, stock: 0 };
            await db.saveItem('products', newProduct);
            setProducts(prevProducts => [newProduct, ...prevProducts]);
            showToast('New product created successfully!', 'success');
            return newProduct;
        } catch (error: any) {
             showToast(error.message, 'error');
             throw error;
        }
    }, [showToast]);

    const updateProduct = useCallback(async (updatedProduct: Product) => {
        try {
            await db.saveItem('products', updatedProduct);
            setProducts(prevProducts => prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));
            showToast('Product updated successfully!', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    }, [showToast]);
    
    const deleteProduct = useCallback(async () => {
        if (!productToDelete) return;
        try {
            await db.deleteItem('products', productToDelete.id);
            setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
            showToast('Product deleted successfully!', 'success');
            setProductToDelete(null);
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    }, [productToDelete, showToast]);

    const handleImportProducts = async (importedProducts: Omit<Product, 'id' | 'stock'>[]) => {
        try {
            let added = 0;
            let updated = 0;
            const currentProducts = [...products];
            for (const importedProd of importedProducts) {
                const existing = currentProducts.find(p => p.sku === importedProd.sku);
                if (existing) {
                    const updatedProduct = { ...existing, ...importedProd };
                    await db.saveItem('products', updatedProduct);
                    updated++;
                } else {
                    const newProduct: Product = { ...importedProd, id: `prod_${Date.now()}_${importedProd.sku}`, stock: 0 };
                    await db.saveItem('products', newProduct);
                    added++;
                }
            }
            setProducts(await db.getAllItems('products'));
            showToast(`Products imported: ${added} new, ${updated} updated.`, 'success');
        } catch(error: any) {
            showToast(error.message, 'error');
        }
    };

    // Customer Management
    const addCustomer = async (customerData: Omit<Customer, 'id' | 'dateAdded' | 'loyaltyPoints'>) => {
        try {
            const newCustomer: Customer = { ...customerData, id: `cust_${Date.now()}`, dateAdded: new Date(), loyaltyPoints: 0 };
            await db.saveItem('customers', newCustomer);
            setCustomers(prev => [newCustomer, ...prev]);
            showToast('Customer added successfully!');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };
    
    const updateCustomer = async (updatedCustomer: Customer) => {
        try {
            await db.saveItem('customers', updatedCustomer);
            setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
            showToast('Customer updated successfully!');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };
    
    const deleteCustomer = async (customerId: string) => {
        if (customerId === 'cust001') {
            showToast('Cannot delete the default Walk-in Customer.', 'error');
            return;
        }
        try {
            await db.deleteItem('customers', customerId);
            setCustomers(prev => prev.filter(c => c.id !== customerId));
            showToast('Customer deleted successfully!');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    // Supplier Management
    const addSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<Supplier | null> => {
        try {
            const newSupplier: Supplier = { ...supplierData, id: `sup_${Date.now()}` };
            await db.saveItem('suppliers', newSupplier);
            setSuppliers(prev => [newSupplier, ...prev]);
            showToast('Supplier added successfully!');
            return newSupplier;
        } catch (error: any) {
            showToast(error.message, 'error');
            return null;
        }
    };

    // Purchase Order Management
    const addPurchaseOrder = useCallback(async (poData: PurchaseOrderData): Promise<PurchaseOrder> => {
        try {
            const newPO: PurchaseOrder = { 
                ...poData, 
                id: `${settings.receipt.poNumberPrefix}${Date.now()}`,
                poNumber: `${settings.receipt.poNumberPrefix}${Date.now()}`,
                items: poData.items.map(i => ({ ...i, quantityReceived: 0 })),
                createdDate: new Date(),
                totalCost: poData.items.reduce((acc, i) => acc + (i.cost * i.quantity), 0)
            };
            await db.saveItem('purchaseOrders', newPO);
            setPurchaseOrders(prev => [newPO, ...prev]);
            showToast(`Purchase Order ${newPO.poNumber} created as ${poData.status}.`, 'success');
            return newPO;
        } catch (error: any) {
            showToast(error.message, 'error');
            throw error;
        }
    }, [showToast, settings.receipt.poNumberPrefix]);

    const handleSendPO = useCallback(async (poId: string) => {
        const po = purchaseOrders.find(p => p.id === poId);
        if (!po) return;
        try {
            const updatedPO = { ...po, status: 'Sent' as const };
            await db.saveItem('purchaseOrders', updatedPO);
            setPurchaseOrders(prevPOs => prevPOs.map(p => p.id === updatedPO.id ? updatedPO : p));
            showToast(`Purchase Order ${updatedPO.poNumber} has been sent.`, 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    }, [purchaseOrders, showToast]);

    const receivePurchaseOrder = useCallback(async (poId: string, receivedItemsFromModal: ReceivedPOItem[]) => {
        try {
            const poToUpdate = purchaseOrders.find(po => po.id === poId);
            if (!poToUpdate) throw new Error("PO not found");

            let allItemsReceived = true;
            const updatedPOItems = poToUpdate.items.map(poItem => {
                const receivedInfo = receivedItemsFromModal.find(ri => ri.productId === poItem.productId);
                if (receivedInfo) {
                    poItem.quantityReceived += receivedInfo.quantityReceived;
                }
                if (poItem.quantityReceived < poItem.quantity) {
                    allItemsReceived = false;
                }
                return poItem;
            });
            
            const updatedPO: PurchaseOrder = { 
                ...poToUpdate, 
                items: updatedPOItems, 
                status: allItemsReceived ? 'Received' : 'Partially Received',
                receivedDate: new Date()
            };
            await db.saveItem('purchaseOrders', updatedPO);
            setPurchaseOrders(prevPOs => prevPOs.map(po => po.id === updatedPO.id ? updatedPO : po));
            
            // Update product stock and details
            const updatedProducts = [...products];
            for (const receivedItem of receivedItemsFromModal) {
                 const productIndex = updatedProducts.findIndex(p => p.id === receivedItem.productId);
                 if(productIndex > -1) {
                     updatedProducts[productIndex].stock += receivedItem.quantityReceived;
                     updatedProducts[productIndex].costPrice = receivedItem.cost;
                     updatedProducts[productIndex].ean = receivedItem.ean;
                     updatedProducts[productIndex].category = receivedItem.category;
                     await db.saveItem('products', updatedProducts[productIndex]);
                 }
            }
            setProducts(updatedProducts);
            
            // Create Supplier Invoice
            const invoiceTotal = receivedItemsFromModal.reduce((acc, item) => acc + (item.cost * item.quantityReceived), 0);
            const newInvoice: SupplierInvoice = {
                id: `INV-${poToUpdate.poNumber}-${Date.now()}`,
                invoiceNumber: `INV-${poToUpdate.poNumber}`,
                purchaseOrderId: poToUpdate.id,
                supplierId: poToUpdate.supplierId,
                invoiceDate: new Date(),
                dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Net 30 default
                subtotal: invoiceTotal,
                taxAmount: 0, // Simplified for now
                totalAmount: invoiceTotal,
                paidAmount: 0,
                status: 'Unpaid',
            };
            await db.saveItem('supplierInvoices', newInvoice);
            setSupplierInvoices(prev => [newInvoice, ...prev]);

            showToast(`Stock for PO ${updatedPO.poNumber} received.`, 'success');
        } catch (error: any) {
             showToast(error.message, 'error');
        }
    }, [showToast, purchaseOrders, products]);
    

    const handleConfirmAddToPO = async (
        product: Product, 
        quantity: number, 
        poId: string | 'new', 
        supplierId?: string
    ) => {
        const poItem: Omit<PurchaseOrderItem, 'quantityReceived'> = {
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            cost: product.costPrice || 0,
            unitOfMeasure: product.unitOfMeasure,
        };

        try {
            if (poId === 'new') {
                if (!supplierId) throw new Error('A supplier must be selected.');
                await addPurchaseOrder({
                    supplierId: supplierId,
                    items: [poItem],
                    status: 'Draft',
                    expectedDate: new Date(new Date().setDate(new Date().getDate() + 7)),
                });
            } else {
                const poToUpdate = purchaseOrders.find(po => po.id === poId);
                if (!poToUpdate) throw new Error('PO not found.');
                
                const existingItemIndex = poToUpdate.items.findIndex(item => item.productId === product.id);
                if (existingItemIndex > -1) {
                    poToUpdate.items[existingItemIndex].quantity += quantity;
                } else {
                    poToUpdate.items.push({ ...poItem, quantityReceived: 0 });
                }
                const updatedPO = { ...poToUpdate, totalCost: poToUpdate.items.reduce((acc, i) => acc + (i.cost * i.quantity), 0) };
                await db.saveItem('purchaseOrders', updatedPO);
                setPurchaseOrders(await db.getAllItems('purchaseOrders'));
            }
            showToast(`${product.name} added to PO.`, 'success');
            setProductForPO(null);
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };


    // Accounts Payable
    const recordSupplierPayment = useCallback(async (invoiceId: string, payment: Omit<SupplierPayment, 'id' | 'invoiceId'>) => {
        try {
            const invoiceToUpdate = supplierInvoices.find(inv => inv.id === invoiceId);
            if (!invoiceToUpdate) throw new Error("Invoice not found");

            const newPaidAmount = invoiceToUpdate.paidAmount + payment.amount;
            const updatedInvoice: SupplierInvoice = {
                ...invoiceToUpdate,
                paidAmount: newPaidAmount,
                status: newPaidAmount >= invoiceToUpdate.totalAmount ? 'Paid' : 'Partially Paid'
            };

            await db.saveItem('supplierInvoices', updatedInvoice);
            setSupplierInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
            showToast('Supplier payment recorded successfully.', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    }, [showToast, supplierInvoices]);

    // Quotations
    const addQuotation = useCallback(async (quotation: Omit<Quotation, 'id'>) => {
        try {
            const newQuotation: Quotation = { ...quotation, id: `${settings.receipt.quotePrefix}${Date.now()}` };
            await db.saveItem('quotations', newQuotation);
            setQuotations(prev => [newQuotation, ...prev]);
            showToast('Quotation created successfully!');
            setIsCreateQuoteModalOpen(false);
            setSelectedQuotation(newQuotation);
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    }, [showToast, settings.receipt.quotePrefix]);

    const convertQuoteToSale = useCallback(async (quote: Quotation) => {
        if (!activeShift) {
            showToast('Please start a shift before converting a quote.', 'error');
            return;
        }
       
        const quoteCartItems: CartItem[] = quote.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                 showToast(`Product "${item.productName}" is no longer available.`, 'error');
                 return null;
            }
            return { ...product, quantity: item.quantity, price: item.price };
        }).filter((item): item is CartItem => item !== null);

        if (quoteCartItems.length !== quote.items.length) {
            return;
        }
        
        setCart(quoteCartItems);
        setSelectedCustomerId(quote.customerId);
        setOriginatingQuoteId(quote.id);
        setCurrentView(View.POS);
        
        try {
            const updatedQuote = {...quote, status: 'Invoiced' as const };
            await db.saveItem('quotations', updatedQuote);
            setQuotations(prev => prev.map(q => q.id === updatedQuote.id ? updatedQuote : q));
            showToast(`Quote #${quote.quoteNumber} loaded into POS.`, 'info');
        } catch(error: any) {
            showToast(error.message, 'error');
            clearCart();
        }
    }, [products, showToast, activeShift, clearCart]);

    // Communication
    const handleEmailRequest = (documentType: 'Receipt' | 'Quotation' | 'Proforma-Invoice' | 'SupplierInvoice' | 'PurchaseOrder', documentId: string, recipientId: string) => {
        setEmailInfo({ documentType, documentId, recipientId });
    };

    const handleSendEmail = (recipientEmail: string, subject: string, body: string) => {
        if (!emailInfo) return;
        const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
        addAuditLog('EMAIL_SENT', `Opened mail client for ${emailInfo.documentType.replace('-',' ')} ${emailInfo.documentId} to ${recipientEmail}.`);
        showToast(`Your email client has been opened to send the ${emailInfo.documentType.replace('-',' ')}.`, 'success');
        setEmailInfo(null);
    };

    const recipientForEmail = useMemo(() => {
        if (!emailInfo) return null;
        if (['SupplierInvoice', 'PurchaseOrder'].includes(emailInfo.documentType)) {
            const supplier = suppliers.find(s => s.id === emailInfo.recipientId);
            return supplier ? { name: supplier.name, email: supplier.email } : null;
        }
        const customer = customers.find(c => c.id === emailInfo.recipientId);
        return customer ? { name: customer.name, email: customer.email } : null;
    }, [emailInfo, customers, suppliers]);

    const handleSendWhatsApp = useCallback((recipients: (Customer | Supplier)[], message: string) => {
        if (recipients.length === 1) {
            const recipient = recipients[0];
            const phone = 'phone' in recipient ? recipient.phone : recipient.contact;
            if (phone && phone !== 'N/A') {
                const whatsappLink = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
                window.open(whatsappLink, '_blank');
                addAuditLog('WHATSAPP_SENT', `Opened WhatsApp to send message to ${recipient.name}.`);
                showToast(`Opening WhatsApp to send message...`, 'success');
            } else {
                showToast(`${recipient.name} does not have a valid phone number.`, 'error');
            }
        } else {
             showToast('Bulk WhatsApp messaging requires a backend integration and is not supported in this frontend-only version.', 'info');
        }
        setWhatsAppInfo(null);
    }, [addAuditLog, showToast]);

    const recipientForWhatsApp = useMemo(() => {
        if (!whatsAppInfo) return undefined;
        if (whatsAppInfo.customerId) return customers.find(c => c.id === whatsAppInfo.customerId);
        if (whatsAppInfo.supplierId) return suppliers.find(s => s.id === whatsAppInfo.supplierId);
        return undefined;
    }, [whatsAppInfo, customers, suppliers]);

    // Data Management
    const handleBackup = async () => {
        try {
            const data = await db.getAllData();
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `kenpos-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            showToast('Data backup successful!', 'success');
        } catch (error: any) {
             showToast(`Backup failed: ${error.message}`, 'error');
        }
    };
    
    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const json = e.target?.result as string;
                const data = JSON.parse(json);
                await db.restoreAllData(data);
                await fetchAllData();
                showToast('Data restored successfully! The app will now reload.', 'success');
                setTimeout(() => window.location.reload(), 2000);
            } catch (error: any) {
                showToast(`Restore failed: ${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    };

    const handleFactoryReset = async () => {
        try {
            await db.wipeDatabase();
            showToast('Factory reset complete. The app will now reload.', 'success');
            setTimeout(() => window.location.reload(), 2000);
        } catch(error: any) {
             showToast(`Factory reset failed: ${error.message}`, 'error');
        }
    };


    const handleSyncLogs = async () => {
        showToast('Simulating log sync to external service...', 'info');
    };

    const handleCreatePOFromSO = useCallback(async (salesOrder: SalesOrder) => {
       try {
           const itemsForPO = salesOrder.items.filter(i => i.status === 'Pending').map(i => ({
               productId: i.productId || `custom_${i.id}`,
               productName: i.description,
               quantity: i.quantity,
               cost: 0, // Should be filled in later
               unitOfMeasure: 'pc(s)', // Default
               salesOrderItemId: i.id
           }));
           
           if(itemsForPO.length === 0) {
               showToast("All items on this Sales Order have already been ordered.", 'info');
               return;
           }

           // Here we assume a single supplier for all items for simplicity
           const firstSupplier = suppliers[0];
           if(!firstSupplier) {
               showToast("Please add at least one supplier before creating a PO.", 'error');
               return;
           }
            const newPO = await addPurchaseOrder({
                supplierId: firstSupplier.id,
                items: itemsForPO,
                status: 'Draft',
                expectedDate: new Date(new Date().setDate(new Date().getDate() + 14)),
                salesOrderId: salesOrder.id
            });

            const updatedSalesOrder: SalesOrder = {
                ...salesOrder,
                items: salesOrder.items.map(i => ({ ...i, status: 'Ordered', purchaseOrderId: newPO.id })),
                status: 'Ordered'
            };
            await db.saveItem('salesOrders', updatedSalesOrder);
            setSalesOrders(prev => prev.map(so => so.id === updatedSalesOrder.id ? updatedSalesOrder : so));
            setSelectedSalesOrder(updatedSalesOrder);
            showToast(`Created Purchase Order ${newPO.poNumber} for Sales Order ${salesOrder.id}.`, 'success');
            setCurrentView(View.Purchases);
       } catch (error: any) {
            showToast(error.message, 'error');
       }
    }, [showToast, suppliers, addPurchaseOrder]);
    
    const handlePushSOToPOS = useCallback((salesOrder: SalesOrder) => {
        if (!activeShift) {
            showToast('Please start a shift before completing a sales order.', 'error');
            return;
        }
        if (cart.length > 0) {
            showToast('Please clear the current cart before loading a sales order.', 'error');
            return;
        }
    
        const cartItems: CartItem[] = salesOrder.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                showToast(`Product "${item.description}" not found in inventory. Cannot proceed.`, 'error');
                return null;
            }
            return { 
                ...product, 
                quantity: item.quantity, 
                price: item.unitPrice, 
                pricingType: item.pricingType 
            };
        }).filter((item): item is CartItem => item !== null);
    
        if (cartItems.length !== salesOrder.items.length) {
            return; 
        }
    
        setCart(cartItems);
        setSelectedCustomerId(salesOrder.customerId);
        setOriginatingSalesOrderId(salesOrder.id);
        setCurrentView(View.POS);
        
        showToast(`Sales Order ${salesOrder.id} loaded into POS for completion.`, 'info');
    
    }, [activeShift, cart, products, showToast]);
    
    if(isAppLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background dark:bg-dark-background">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full animate-spin border-4 border-dashed border-primary dark:border-dark-primary border-t-transparent"></div>
                    <span className="font-semibold text-foreground dark:text-dark-foreground">Loading Banduka POS™...</span>
                </div>
            </div>
        );
    }

    const renderView = () => {
        if (!currentUser) return null; // Should be handled by AuthView
        const userPermissions = settings.permissions[currentUser.role] || [];
        
        if (selectedWorkOrder) {
            return (
                <WorkOrderDetailView
                    workOrder={selectedWorkOrder}
                    users={users}
                    settings={settings}
                    onBack={() => setSelectedWorkOrder(null)}
                    onUpdate={handleUpdateWorkOrder}
                    onPushToPOS={handlePushWorkOrderToPOS}
                />
            );
        }

        if (selectedSalesOrder) {
            return (
                <SalesOrderDetailView
                    salesOrder={selectedSalesOrder}
                    onBack={() => setSelectedSalesOrder(null)}
                    onCreatePO={handleCreatePOFromSO}
                    onPushToPOS={handlePushSOToPOS}
                />
            );
        }
        
        if (selectedLayaway) {
            return (
                <LayawayDetailView
                    layaway={selectedLayaway}
                    onBack={() => setSelectedLayaway(null)}
                    onAddPayment={handleAddLayawayPayment}
                />
            );
        }

        switch (currentView) {
            case View.POS:
                return (
                    <PosView
                        products={products}
                        cart={cart}
                        customers={customers}
                        selectedCustomerId={selectedCustomerId}
                        onCustomerChange={setSelectedCustomerId}
                        addToCart={addToCart}
                        updateCartItemQuantity={updateCartItemQuantity}
                        removeFromCart={removeFromCart}
                        clearCart={clearCart}
                        completeSale={completeSale}
                        isOnline={isOnline}
                        currentUser={currentUser}
                        settings={settings}
                        sales={sales}
                        payouts={payouts}
                        activeShift={activeShift}
                        onStartShift={handleStartShift}
                        onEndShiftRequest={() => setIsEndingShift(true)}
                        isEndingShift={isEndingShift}
                        onConfirmEndShift={handleEndShift}
                        onCancelEndShift={() => setIsEndingShift(false)}
                        shiftReportToShow={shiftReportToShow}
                        onCloseShiftReport={() => setShiftReportToShow(null)}
                        onEmailReceiptRequest={(saleId, customerId) => handleEmailRequest('Receipt', saleId, customerId)}
                        onWhatsAppReceiptRequest={(saleId, customerId) => setWhatsAppInfo({ mode: 'receipt', documentId: saleId, customerId })}
                        onHoldRequest={() => setIsHoldModalOpen(true)}
                        workOrders={workOrders}
                        originatingWorkOrderId={originatingWorkOrderId}
                    />
                );
            case View.Dashboard:
                 return <DashboardView sales={sales} products={products} suppliers={suppliers} supplierInvoices={supplierInvoices} />;
            case View.Inventory:
                 return <InventoryView products={products} onUpdateProduct={updateProduct} onDeleteProductRequest={setProductToDelete} permissions={userPermissions} onAddProduct={addProduct} onImportProducts={handleImportProducts} onPrintBarcodeRequest={setProductToPrintBarcode} onAddToPORequest={setProductForPO} settings={settings} />;
            case View.Purchases:
                return <PurchasesView purchaseOrders={purchaseOrders} suppliers={suppliers} products={products} onReceivePORequest={setPoToReceive} onAddPurchaseOrder={addPurchaseOrder} onAddSupplier={addSupplier} permissions={userPermissions} onSendPO={handleSendPO} onEmailPORequest={(poId, supplierId) => handleEmailRequest('PurchaseOrder', poId, supplierId)} onWhatsAppPORequest={(poId, supplierId) => setWhatsAppInfo({ mode: 'po', documentId: poId, supplierId })} settings={settings} />;
            case View.AccountsPayable:
                return invoiceToView ? (
                     <InvoiceDetailView
                        invoice={invoiceToView}
                        supplier={suppliers.find(s => s.id === invoiceToView.supplierId)}
                        purchaseOrder={purchaseOrders.find(po => po.id === invoiceToView.purchaseOrderId)}
                        settings={settings}
                        onBack={() => setInvoiceToView(null)}
                        onEmailRequest={(docId, supplierId) => handleEmailRequest('SupplierInvoice', docId, supplierId)}
                    />
                ) : (
                    <AccountsPayableView 
                        invoices={supplierInvoices} 
                        suppliers={suppliers} 
                        onRecordPayment={recordSupplierPayment} 
                        onViewInvoice={setInvoiceToView}
                    />
                );
            case View.TaxReports:
                 return <TaxReportView sales={sales} supplierInvoices={supplierInvoices} settings={settings} />;
            case View.PaymentSummary:
                 return <PaymentSummaryView sales={sales} users={users} />;
            case View.ShiftReport:
                return <ShiftReportView shifts={shifts} sales={sales} payouts={payouts} settings={settings} />;
            case View.SalesHistory:
                return saleToView ? (
                    <ReceiptDetailView
                        sale={saleToView}
                        settings={settings}
                        currentUser={currentUser}
                        onBack={() => setSaleToView(null)}
                        onEmailReceiptRequest={handleEmailRequest}
                    />
                ) : (
                    <SalesHistoryView
                        sales={sales}
                        customers={customers}
                        users={users}
                        onViewSaleRequest={setSaleToView}
                    />
                );
            case View.Customers:
                return <CustomersView customers={customers} sales={sales} onAddCustomer={addCustomer} onUpdateCustomer={updateCustomer} onDeleteCustomer={deleteCustomer} permissions={userPermissions} settings={settings} />;
            case View.Quotations:
                 return selectedQuotation ? (
                    <QuotationDetailView
                        quotation={selectedQuotation}
                        settings={settings}
                        sales={sales}
                        onBack={() => setSelectedQuotation(null)}
                        onConvertQuoteToSale={quote => {
                            convertQuoteToSale(quote);
                            setSelectedQuotation(null);
                        }}
                        onEmailRequest={(type, quoteId, customerId) => handleEmailRequest(type, quoteId, customerId)}
                        permissions={userPermissions}
                    />
                ) : (
                    <QuotationsView
                        quotations={quotations}
                        sales={sales}
                        onSelectQuotation={setSelectedQuotation}
                        onCreateQuoteRequest={() => setIsCreateQuoteModalOpen(true)}
                        permissions={userPermissions}
                    />
                );
            case View.Staff:
                return <StaffView 
                    users={users} 
                    permissions={userPermissions} 
                    onAddUser={addUser} 
                    onUpdateUser={updateUser} 
                    onDeleteUser={deleteUser}
                    onManagePermissionsRequest={() => { setSettingsModalToShow('users-perms'); setCurrentView(View.Settings); }}
                />;
            case View.TimeSheets:
                return <TimeSheetsView 
                    timeClockEvents={timeClockEvents}
                    users={users}
                    permissions={userPermissions}
                    onEditRequest={setTimeClockEventToEdit}
                    onAddRequest={() => setTimeClockEventToEdit({} as TimeClockEvent)}
                    onDeleteRequest={handleDeleteTimeClockEvent}
                />;
            case View.Settings:
                return <SettingsView 
                    settings={settings} 
                    onUpdateSettings={updateSettings} 
                    users={users} 
                    auditLogs={auditLogs} 
                    showToast={showToast} 
                    onBackup={handleBackup}
                    onRestoreRequest={() => restoreInputRef.current?.click()}
                    onFactoryResetRequest={() => setIsFactoryResetModalOpen(true)}
                    onSyncLogs={handleSyncLogs}
                    openModalId={settingsModalToShow}
                    onModalOpened={() => setSettingsModalToShow(null)}
                    onTestBarcodePrint={() => setProductToPrintBarcode({ id: 'test-001', name: 'Sample Label', sku: 'SKU-TEST', ean: '1234567890128', price: 99.99, category: 'Test', stock: 1, productType: 'Inventory', pricingType: 'inclusive', unitOfMeasure: 'pc(s)', imageUrl: '' })}
                />;
            case View.ReturnReceipt:
                return <ReturnReceiptView sales={sales} activeShift={activeShift} onProcessReturn={handleProcessReturn} onBack={() => setCurrentView(View.POS)} />;
            case View.Payout:
                return <PayoutView activeShift={activeShift} onProcessPayout={handleProcessPayout} onBack={() => setCurrentView(View.POS)} />;
            case View.Layaway:
                return <NewLayawayView products={products} customers={customers} settings={settings} onAddLayaway={handleAddLayaway} onBack={() => setCurrentView(View.POS)} activeShift={activeShift} />;
            case View.WorkOrder:
                return <NewWorkOrderView customers={customers} users={users} settings={settings} onAddWorkOrder={handleAddWorkOrder} onBack={() => setCurrentView(View.POS)} activeShift={activeShift} />;
            case View.LayawayList:
                return <LayawayListView layaways={layaways} onSelectLayaway={setSelectedLayaway} />;
            case View.WorkOrderList:
                return <WorkOrderListView workOrders={workOrders} users={users} onViewWorkOrder={setSelectedWorkOrder} />;
            case View.SalesOrder:
                return <NewSalesOrderView products={products} customers={customers} settings={settings} onAddSalesOrder={handleAddSalesOrder} onBack={() => setCurrentView(View.POS)} activeShift={activeShift} />;
            case View.SalesOrderList:
                return <SalesOrderListView salesOrders={salesOrders} onViewSalesOrder={setSelectedSalesOrder} />;
            case View.HeldReceipts: 
                return <HeldReceiptsView 
                    heldReceipts={heldReceipts}
                    onRecallReceipt={handleRecallReceipt}
                    onDeleteReceiptRequest={setReceiptToDelete}
                />;
            case View.OpenCashDrawer: return null; // Handled by modal
            default:
                return <PlaceholderView viewName={currentView} />;
        }
    };

    if (!isAuthenticated) {
        switch (authView) {
            case 'signup':
                return <SignUpView onSignUp={handleSignUp} onNavigateToLogin={() => setAuthView('login')} />;
            case 'forgot_password':
                return <ForgotPasswordView 
                    onFindUser={handleFindUserForRecovery}
                    onResetPassword={handleResetPassword}
                    onBackToLogin={() => {
                        setRecoveryUser(null);
                        setAuthView('login');
                    }}
                />;
            case 'login':
            default:
                 return <LoginView 
                    onLogin={handleLogin} 
                    onForgotPassword={() => setAuthView('forgot_password')} 
                    onNavigateToSignUp={() => setAuthView('signup')} 
                />;
        }
    }

    if (!settings.isSetupComplete && currentUser?.role === 'Admin') {
        return <SetupWizard 
            settings={settings}
            onUpdateSettings={updateSettings}
            showToast={showToast}
            onSetupComplete={() => {
                updateSettings({ isSetupComplete: true });
                showToast('Setup complete! Welcome to Banduka POS™.', 'success');
            }}
        />;
    }

    return (
        <div className="flex h-full bg-background dark:bg-dark-background font-sans">
            <AnimatePresence>
                {isLocked && currentUser && (
                    <PinLockView
                        currentUser={currentUser}
                        onUnlock={() => setIsLocked(false)}
                        onForceLogout={handleLogout}
                    />
                )}
            </AnimatePresence>
            <input type="file" ref={restoreInputRef} onChange={handleRestore} accept=".json" className="hidden" />
            {currentUser && (
                <Sidebar 
                    currentView={currentView} 
                    setCurrentView={setCurrentView}
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                    role={currentUser.role}
                    permissions={settings.permissions[currentUser.role] || []}
                />
            )}
            <div className="flex-1 flex flex-col overflow-hidden">
                {currentUser && (
                    <Header 
                        isOnline={isOnline} 
                        isSyncing={false}
                        queuedSalesCount={0}
                        onMenuClick={() => setIsSidebarOpen(true)}
                        currentUser={currentUser}
                        onLogout={handleLogout}
                        products={products}
                        currentEvent={currentEvent}
                        settings={settings}
                        theme={theme}
                        onToggleTheme={toggleTheme}
                        onInstallClick={handleInstallClick}
                        installPromptEvent={installPromptEvent}
                        activeTimeClockEvent={activeTimeClockEvent}
                        onClockIn={handleClockIn}
                        onClockOut={handleClockOut}
                    />
                )}
                <main className="flex-1 overflow-y-auto bg-background dark:bg-dark-background relative">
                    <AnimatePresence mode="wait">
                        <AnimatedView key={currentView + (selectedSalesOrder ? selectedSalesOrder.id : '') + (selectedWorkOrder ? selectedWorkOrder.id : '') + (selectedLayaway ? selectedLayaway.id : '')}>
                            {renderView()}
                        </AnimatedView>
                    </AnimatePresence>
                </main>
            </div>
             {updateAvailable && <UpdateNotification onUpdate={handleAppUpdate} />}
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </AnimatePresence>
             {productToDelete && (
                <ConfirmationModal
                    title={`Delete ${productToDelete.name}?`}
                    message="Are you sure you want to permanently delete this product? This action cannot be undone."
                    onConfirm={deleteProduct}
                    onClose={() => setProductToDelete(null)}
                    isDestructive
                />
            )}
            {poToReceive && (
                <ReceivePOModal 
                    purchaseOrder={poToReceive} 
                    supplier={suppliers.find(s => s.id === poToReceive.supplierId)}
                    products={products}
                    onConfirm={(receivedItems) => {
                        receivePurchaseOrder(poToReceive.id, receivedItems);
                        setPoToReceive(null);
                    }}
                    onClose={() => setPoToReceive(null)}
                />
            )}
             {productForPO && (
                <AddToPOModal 
                    product={productForPO} 
                    purchaseOrders={purchaseOrders.filter(po => po.status === 'Draft' || po.status === 'Sent')}
                    suppliers={suppliers}
                    onClose={() => setProductForPO(null)}
                    onConfirm={handleConfirmAddToPO}
                />
            )}
            {productToPrintBarcode && (
                <BarcodePrintModal 
                    product={productToPrintBarcode}
                    onClose={() => setProductToPrintBarcode(null)}
                />
            )}
            {isCreateQuoteModalOpen && (
                <CreateQuotationForm 
                    customers={customers}
                    products={products}
                    settings={settings}
                    onCancel={() => setIsCreateQuoteModalOpen(false)}
                    onSave={addQuotation}
                />
            )}
            {emailInfo && recipientForEmail && (
                <EmailModal
                    documentType={emailInfo.documentType}
                    documentId={emailInfo.documentId}
                    recipientName={recipientForEmail.name}
                    defaultEmail={recipientForEmail.email}
                    onClose={() => setEmailInfo(null)}
                    onSend={handleSendEmail}
                />
            )}
            {whatsAppInfo && (
                <WhatsAppModal 
                    mode={whatsAppInfo.mode}
                    recipient={recipientForWhatsApp}
                    customers={customers}
                    documentId={whatsAppInfo.documentId}
                    onClose={() => setWhatsAppInfo(null)}
                    onSend={handleSendWhatsApp}
                />
            )}
             {timeClockEventToEdit && (
                <TimeClockModal 
                    event={timeClockEventToEdit}
                    users={users}
                    onClose={() => setTimeClockEventToEdit(null)}
                    onSave={handleSaveTimeClockEvent}
                />
            )}
            {isCashDrawerModalOpen && (
                 <ConfirmationModal
                    title="Open Cash Drawer"
                    message="Are you sure you want to manually open the cash drawer?"
                    confirmText="Open"
                    onConfirm={handleOpenCashDrawer}
                    onClose={() => {
                        setIsCashDrawerModalOpen(false);
                        setCurrentView(viewBeforeModal); // go back
                    }}
                />
            )}
            {isHoldModalOpen && (
                <HoldReceiptModal
                    onConfirm={handleHoldReceipt}
                    onClose={() => setIsHoldModalOpen(false)}
                />
            )}
            {receiptToDelete && (
                <ConfirmationModal
                    title={`Delete "${receiptToDelete.name}"?`}
                    message="Are you sure you want to permanently delete this held receipt? This action cannot be undone."
                    onConfirm={handleDeleteHeldReceipt}
                    onClose={() => setReceiptToDelete(null)}
                    confirmText="Delete"
                    isDestructive
                />
            )}
            {isFactoryResetModalOpen && (
                 <ConfirmationModal
                    title="Confirm Factory Reset"
                    message="This will permanently delete ALL data, including sales, products, and settings. This action cannot be undone. Please ensure you have a backup."
                    confirmText="RESET"
                    onConfirm={() => {
                        handleFactoryReset();
                        setIsFactoryResetModalOpen(false);
                    }}
                    onClose={() => setIsFactoryResetModalOpen(false)}
                    isDestructive
                />
            )}
        </div>
    );
};

export default App;