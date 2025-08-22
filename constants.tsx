

import React from 'react';
import { Product, Customer, Supplier, PurchaseOrder, SupplierInvoice, User, Settings, AuditLog, Permission, Role, Quotation, BusinessType } from './types';

export const MOCK_PRODUCTS: Product[] = [];
export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'cust001', name: 'Walk-in Customer', phone: 'N/A', email: 'walkin@kenpos.co.ke', address: 'N/A', city: 'N/A', dateAdded: new Date('2023-01-01'), loyaltyPoints: 0 },
];
export const MOCK_USERS: User[] = [];
export const MOCK_SUPPLIERS: Supplier[] = [];
export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [];
export const MOCK_SUPPLIER_INVOICES: SupplierInvoice[] = [];
export const MOCK_QUOTATIONS: Quotation[] = [];
export const MOCK_AUDIT_LOGS: AuditLog[] = [];

export const DEFAULT_SETTINGS: Settings = {
    id: 'kenpos_settings', // Fixed ID for single settings object in DB
    isSetupComplete: false,
    businessType: 'GeneralRetail',
    businessInfo: {
        name: 'My Biashara Ltd.',
        kraPin: 'P000000000X',
        logoUrl: '',
        location: 'Biashara Street, Nairobi',
        phone: '0712 345 678',
        email: 'sales@mybiashara.co.ke',
        branch: 'Main Branch',
        currency: 'KES',
        language: 'en-US',
    },
    tax: {
        vatEnabled: true,
        vatRate: 16,
        pricingType: 'inclusive',
        etrEnabled: false,
    },
    discount: {
        enabled: true,
        type: 'percentage',
        maxValue: 10,
    },
    communication: {
        sms: {
            provider: 'none',
            username: 'sandbox',
            apiKey: '',
            senderId: '',
            useSandbox: true,
        },
        email: {
            mailer: 'smtp',
            host: 'smtp.mailtrap.io',
            port: 587,
            username: '',
            password: '',
            encryption: 'tls',
            fromAddress: 'sales@kenpos.co.ke',
            fromName: 'KenPOS Sales',
        },
        whatsapp: {
            provider: 'none',
            apiKey: '',
            apiSecret: '',
            senderPhoneNumber: '',
        },
        mpesa: {
            enabled: false,
            environment: 'sandbox',
            shortcode: '',
            consumerKey: '',
            consumerSecret: '',
            passkey: '',
            callbackUrl: '',
        }
    },
    receipt: {
        footer: 'Thank you for your business!',
        invoicePrefix: 'INV-',
        quotePrefix: 'QUO-',
        poNumberPrefix: 'PO-',
        layawayPrefix: 'LAY-',
        workOrderPrefix: 'WO-',
        salesOrderPrefix: 'SO-',
    },
    hardware: {
        printer: {
            type: 'Browser',
            connection: 'USB',
            name: '',
            address: '',
        },
        barcodeScanner: {
            enabled: true,
        },
        barcodePrinter: {
            enabled: false,
            type: 'Image',
            connection: 'USB',
            name: '',
        },
    },
    loyalty: {
        enabled: true,
        pointsPerKsh: 100,
        redemptionRate: 0.5, // 1 point = 0.5 KES
        minRedeemablePoints: 100,
        maxRedemptionPercentage: 50,
    },
    measurements: {
        enabled: false,
        units: ['pc(s)', 'in', 'cm', 'm', 'kg', 'g', 'sq ft', 'ltr', 'hr'],
        templates: [
            { name: "Men's Suit", fields: ["Chest", "Waist", "Sleeve", "Inseam", "Neck", "Shoulder"] },
            { name: "Women's Dress", fields: ["Bust", "Waist", "Hips", "Shoulder to Waist", "Waist to Hem"] },
        ],
    },
    permissions: {
        Admin: ['view_dashboard', 'view_pos', 'view_inventory', 'edit_inventory', 'delete_inventory', 'view_purchases', 'manage_purchases', 'view_ap', 'manage_ap', 'view_tax_reports', 'view_shift_report', 'view_sales_history', 'view_customers', 'manage_customers', 'view_settings', 'view_quotations', 'manage_quotations', 'view_staff', 'manage_staff', 'view_timesheets', 'manage_timesheets', 'manage_returns', 'manage_payouts', 'manage_sales_orders', 'manage_layaways', 'manage_work_orders', 'view_held_receipts', 'open_cash_drawer', 'view_payment_summary'],
        Cashier: ['view_pos', 'view_shift_report', 'view_customers', 'open_cash_drawer'],
        Supervisor: ['view_dashboard', 'view_pos', 'view_inventory', 'edit_inventory', 'view_purchases', 'view_shift_report', 'view_sales_history', 'view_customers', 'manage_customers', 'view_quotations', 'manage_quotations', 'view_staff', 'view_timesheets', 'manage_timesheets', 'manage_returns', 'manage_payouts', 'manage_sales_orders', 'manage_layaways', 'manage_work_orders', 'view_held_receipts', 'open_cash_drawer', 'view_payment_summary'],
        Accountant: ['view_dashboard', 'view_purchases', 'manage_purchases', 'view_ap', 'manage_ap', 'view_tax_reports', 'view_sales_history', 'view_customers', 'view_payment_summary'],
    },
    paymentMethods: {
        enabled: false,
        displayOnDocuments: ['Invoice', 'Quotation', 'Receipt'],
        bank: [],
        mpesaPaybill: {
            paybillNumber: '',
            accountNumber: '',
        },
        mpesaTill: {
            tillNumber: '',
        },
    }
};

export const BUSINESS_TYPES_CONFIG: { [key in BusinessType]: { name: string; description: string; icon: React.ReactNode; } } = {
    GeneralRetail: {
        name: 'General Retail',
        description: 'For kiosks, shops, boutiques, hardware stores, or any business selling physical items.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
    },
    Restaurant: {
        name: 'Restaurant / Cafe',
        description: 'For businesses serving food and drinks, with features for table management and kitchen orders.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M17 5v16"/><path d="M21 5v16"/><path d="M15 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2Z"/></svg>
    },
    Salon: {
        name: 'Salon / Barber',
        description: 'For spas, salons, and barbershops with appointment booking and stylist management.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4"/><path d="M20 7V5c0-1.7-1.3-3-3-3h-1"/><path d="M4 12H2"/><path d="M5 5V7"/><path d="M12 22v-2"/><path d="M12 2v2"/><path d="M12 8a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2Z"/><path d="M8.5 8.5 7 7"/><path d="m15.5 8.5 1.5-1.5"/><path d="M8.5 15.5 7 17"/><path d="m15.5 15.5 1.5 1.5"/><path d="M12 17v-2"/><path d="M4 17c-1.7 0-3-1.3-3-3v-1"/><path d="M20 17c1.7 0 3-1.3 3-3v-1"/></svg>
    },
    Services: {
        name: 'Professional Services',
        description: 'For consultants, repair shops, or any business selling time-based or custom services.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    }
};

export const ICONS = {
    pos: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8a2 2 0 0 1 0 2.8l-6 6a2 2 0 0 1-2.8 0l-4-4a2 2 0 0 1 0-2.8l2-2a2 2 0 0 1 2.8 0z"/></svg>,
    inventory: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
    purchases: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18a4 4 0 0 1-4-4h16.5a3.5 3.5 0 0 0-3.5-3.5V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4"/><path d="M5 14H2"/><path d="M17 18a4 4 0 0 0 4-4h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
    quotations: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V21c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h7.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"/><path d="M15 2v5h5"/><path d="M10 16s-1-2-3-2"/><path d="M10 11s-1-2-3-2"/></svg>,
    ap: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8"/><line x1="19" x2="19" y1="14"/><line x1="16" x2="22" y1="11"/></svg>,
    tax: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2"/><line x1="12" x2="12" y1="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    paymentSummary: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
    shiftReport: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8a2 2 0 0 0 2-2V7H6v12a2 2 0 0 0 2 2Z"/><path d="M16 3h-2.26a2 2 0 0 0-1.9-1.44H12.16A2 2 0 0 0 10.27 3H8"/><path d="M15 11h-2"/><path d="M15 15h-2"/></svg>,
    salesHistory: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
    customers: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    staff: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-10 0c-2 1.5-4 4.63-4 8"/></svg>,
    timeSheets: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    settings: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    install: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
    bell: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
    moon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
    sun: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
    business: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16s-1 4-4 4"/><path d="M6 16s1 4 4 4"/><path d="M18 16s-1 4-4 4"/><path d="M18 16s1 4 4 4"/><path d="M6 10h12"/><path d="M6 10s-1 4-4 4"/><path d="M6 10s1 4 4 4"/><path d="M18 10s-1 4-4 4"/><path d="M18 10s1 4 4 4"/><path d="M12 2v8"/><path d="M6 2h12"/></svg>,
    hardware: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z"/><path d="M20 17V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12"/><path d="M6 13H4"/><path d="M11 13H9"/><path d="m14 13-1 5"/><path d="m20 13-1 5"/></svg>,
    receipt: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h6"/><path d="M12 17.5.5 12"/></svg>,
    discount: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
    loyalty: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
    measurements: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L3 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/><path d="M6 16v-1.5a2.5 2.5 0 0 0-5 0V16"/><path d="M18 6v1.5a2.5 2.5 0 0 1 5 0V6"/></svg>,
    users: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    email: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    sms: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14h-2.5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2H17a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z"/><path d="M17 9.5a2 2 0 0 0-2 2v1"/><path d="M12.5 14H11a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h1.5a2 2 0 0 1 2 2v1"/><path d="M5 18a2 2 0 0 0 2 2h1.5"/><path d="M5 14.5V13a2 2 0 0 1 2-2h1"/><path d="M21 12c0-5.52-4.48-10-10-10S1 6.48 1 12s4.48 10 10 10"/></svg>,
    whatsapp: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>,
    mpesa: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14h.01"/><path d="M7 14h.01"/><path d="M12 14h.01"/><path d="M17 18h.01"/><path d="M7 18h.01"/><path d="M12 18h.01"/><path d="M12 6h.01"/><path d="M7 10h.01"/><path d="M12 10h.01"/><path d="M17 10h.01"/><path d="M7 6h.01"/><path d="M17 6h.01"/><rect width="20" height="20" x="2" y="2" rx="2"/></svg>,
    audit: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z"/><path d="M6 18h12"/><path d="M6 14h12"/><path d="M6 10h12"/><path d="M6 6h12"/></svg>,
    data: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>,
    reset: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
    barcode: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/></svg>,
    production: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    // POS Sub-menu Icons
    returnReceipt: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 16-4 4-4-4"/><path d="M11 16V4"/><path d="M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/></svg>,
    payout: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>,
    salesOrder: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m17 14 5-5"/></svg>,
    layaway: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M12 12H8"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
    workOrder: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a5 5 0 0 1-10 0"/><path d="M22 17a5 5 0 0 0-10 0"/><path d="M12 17H2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4z"/><path d="M19 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="m10.5 13.5-5-5"/><path d="m13.5 10.5-5-5"/></svg>,
    heldReceipts: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
    openDrawer: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 15h10"/><path d="M7 11h10"/><path d="M7 7h10"/><path d="M12 21v-4"/><path d="M10 3v4"/><path d="M14 3v4"/><path d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z"/></svg>,
};

export const PERMISSIONS_CONFIG: { module: string, permissions: { id: Permission, label: string }[] }[] = [
    {
        module: 'Core Access',
        permissions: [
            { id: 'view_dashboard', label: 'View Dashboard' },
            { id: 'view_pos', label: 'Access Point of Sale' },
            { id: 'view_settings', label: 'View Settings' },
        ]
    },
    {
        module: 'Point of Sale Actions',
        permissions: [
            { id: 'manage_returns', label: 'Process Returns' },
            { id: 'manage_payouts', label: 'Process Payouts' },
            { id: 'manage_sales_orders', label: 'Manage Sales Orders' },
            { id: 'manage_layaways', label: 'Manage Layaways' },
            { id: 'manage_work_orders', label: 'Manage Work Orders' },
            { id: 'view_held_receipts', label: 'View Held Receipts' },
            { id: 'open_cash_drawer', label: 'Open Cash Drawer Manually' },
        ]
    },
    {
        module: 'Inventory & Products',
        permissions: [
            { id: 'view_inventory', label: 'View Inventory' },
            { id: 'edit_inventory', label: 'Edit Inventory (add, update stock)' },
            { id: 'delete_inventory', label: 'Delete Inventory Items' },
        ]
    },
    {
        module: 'Purchasing & Suppliers',
        permissions: [
            { id: 'view_purchases', label: 'View Purchase Orders' },
            { id: 'manage_purchases', label: 'Manage Purchase Orders' },
            { id: 'view_ap', label: 'View Accounts Payable' },
            { id: 'manage_ap', label: 'Manage Accounts Payable' },
        ]
    },
    {
        module: 'Sales & Customers',
        permissions: [
            { id: 'view_sales_history', label: 'View Sales History' },
            { id: 'view_customers', label: 'View Customers' },
            { id: 'manage_customers', label: 'Manage Customers' },
            { id: 'view_quotations', label: 'View Quotations' },
            { id: 'manage_quotations', label: 'Manage Quotations' },
        ]
    },
    {
        module: 'Staff & Reporting',
        permissions: [
            { id: 'view_staff', label: 'View Staff Members' },
            { id: 'manage_staff', label: 'Manage Staff Members' },
            { id: 'view_timesheets', label: 'View Time Sheets' },
            { id: 'manage_timesheets', label: 'Manage Time Sheets' },
            { id: 'view_shift_report', label: 'View Shift Reports' },
            { id: 'view_tax_reports', label: 'View Tax Reports' },
            { id: 'view_payment_summary', label: 'View Payment Summary' },
        ]
    }
];