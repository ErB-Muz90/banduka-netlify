export type BusinessType = 'GeneralRetail' | 'Restaurant' | 'Salon' | 'Services';

export enum View {
    POS = 'POS',
    Dashboard = 'Dashboard',
    Inventory = 'Inventory',
    Purchases = 'Purchases',
    AccountsPayable = 'AccountsPayable',
    TaxReports = 'TaxReports',
    PaymentSummary = 'PaymentSummary',
    ShiftReport = 'ShiftReport',
    SalesHistory = 'SalesHistory',
    Customers = 'Customers',
    Quotations = 'Quotations',
    Staff = 'Staff',
    TimeSheets = 'TimeSheets',
    Settings = 'Settings',
    // POS Sub-menu
    ReturnReceipt = 'ReturnReceipt',
    Payout = 'Payout',
    SalesOrder = 'SalesOrder',
    Layaway = 'Layaway',
    WorkOrder = 'WorkOrder',
    HeldReceipts = 'HeldReceipts',
    SalesOrderList = 'SalesOrderList',
    LayawayList = 'LayawayList',
    WorkOrderList = 'WorkOrderList',
    OpenCashDrawer = 'OpenCashDrawer',
}


export interface Product {
  id: string;
  name: string;
  sku: string;
  ean?: string; // European Article Number / Universal Barcode
  description?: string;
  category: string;
  price: number;
  pricingType: 'inclusive' | 'exclusive';
  productType: 'Inventory' | 'Service';
  costPrice?: number;
  stock: number;
  imageUrl: string;
  unitOfMeasure: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Payment {
  method: 'Cash' | 'M-Pesa' | 'Card' | 'Points';
  amount: number;
  details?: {
    transactionCode?: string;
    phoneNumber?: string;
  }
}

export interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  payments: Payment[];
  change: number;
  customerId: string;
  date: Date;
  synced: boolean;
  cashierId: string;
  cashierName: string;
  shiftId: string;
  // Loyalty fields
  pointsEarned: number;
  pointsUsed: number;
  pointsValue: number;
  pointsBalanceAfter: number;
  // Link to original quotation
  quotationId?: string;
  // New fields for returns
  type?: 'Sale' | 'Return';
  originalSaleId?: string;
  returnReason?: string;
  salesOrderId?: string;
  workOrderId?: string;
  depositApplied?: number;
}

export type SaleData = Omit<Sale, 'id' | 'synced' | 'cashierId' | 'cashierName' | 'pointsEarned' | 'pointsBalanceAfter' | 'shiftId'>;

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  dateAdded: Date;
  loyaltyPoints: number;
  measurements?: { [key: string]: string };
}

export interface Supplier {
    id: string;
    name: string;
    contact: string;
    email: string;
    creditTerms: string;
}

export interface PurchaseOrderItem {
    productId: string;
    productName: string;
    quantity: number; // Ordered quantity
    cost: number;
    quantityReceived: number; // Total quantity received for this item so far
    unitOfMeasure: string;
    salesOrderItemId?: string; // Link back to the specific sales order item
}

export interface ReceivedPOItem extends Omit<PurchaseOrderItem, 'quantityReceived'> {
    quantityReceived: number;
    ean?: string;
    category: string;
}

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    supplierId: string;
    items: PurchaseOrderItem[];
    status: 'Draft' | 'Sent' | 'Received' | 'Partially Received' | 'Cancelled';
    createdDate: Date;
    expectedDate: Date;
    receivedDate?: Date;
    totalCost: number;
    salesOrderId?: string;
}

export interface PurchaseOrderData {
    supplierId: string;
    items: Omit<PurchaseOrderItem, 'quantityReceived'>[];
    status: 'Draft' | 'Sent';
    expectedDate: Date;
    salesOrderId?: string;
}


export interface SupplierPayment {
    id: string;
    invoiceId: string;
    paymentDate: Date;
    amount: number;
    method: 'Bank Transfer' | 'Cash' | 'M-Pesa';
}

export interface SupplierInvoice {
    id: string;
    invoiceNumber: string;
    purchaseOrderId: string;
    supplierId: string;
    invoiceDate: Date;
    dueDate: Date;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    paidAmount: number;
    status: 'Unpaid' | 'Partially Paid' | 'Paid';
}

export interface QuotationItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number; // Price at the time of quotation
  pricingType: 'inclusive' | 'exclusive';
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  items: QuotationItem[];
  status: 'Draft' | 'Sent' | 'Invoiced' | 'Expired';
  createdDate: Date;
  expiryDate: Date;
  subtotal: number;
  tax: number;
  total: number;
}

export interface LayawayPayment {
  date: Date;
  amount: number;
  method: 'Cash' | 'M-Pesa' | 'Card';
  cashierId: string;
}

export interface Layaway {
  id: string; // layawayNumber
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  deposit: number;
  payments: LayawayPayment[];
  balance: number;
  status: 'Active' | 'Completed' | 'Defaulted' | 'Cancelled';
  createdDate: Date;
  expiryDate: Date;
  cashierId: string;
  cashierName: string;
  shiftId: string;
}

export interface WorkOrder {
  id: string; // workOrderNumber
  customerId: string;
  customerName: string;
  itemToService: string;
  descriptionOfWork: string;
  estimatedCost: number;
  depositPaid: number;
  assignedToId?: string; // staff user id
  status: 'Pending' | 'In Progress' | 'Awaiting Parts' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
  createdDate: Date;
  promisedByDate: Date;
  completedDate?: Date;
  cashierId: string;
  cashierName: string;
  shiftId: string;
}

export interface SalesOrderItem {
  id: string; // unique ID within the SO
  description: string;
  quantity: number;
  unitPrice: number; // price quoted to customer
  pricingType: 'inclusive' | 'exclusive';
  status: 'Pending' | 'Ordered' | 'Received';
  productId?: string; // linked product ID once created
  purchaseOrderId?: string;
}

export interface SalesOrder {
  id: string; // salesOrderNumber
  customerId: string;
  customerName: string;
  items: SalesOrderItem[];
  total: number;
  deposit: number;
  balance: number;
  status: 'Pending' | 'Ordered' | 'Partially Received' | 'Received' | 'Completed' | 'Cancelled';
  createdDate: Date;
  deliveryDate?: Date;
  shippingAddress?: string;
  notes?: string;
  cashierId: string;
  cashierName: string;
  shiftId: string;
}

export interface HeldReceipt {
  id: string;
  name: string;
  items: CartItem[];
  customerId: string;
  heldAt: Date;
  cashierId: string;
  cashierName: string;
}


export type Permission = 
  'view_dashboard' | 'view_pos' | 'view_inventory' | 'edit_inventory' | 'delete_inventory' |
  'view_purchases' | 'manage_purchases' | 'view_ap' | 'manage_ap' | 'view_tax_reports' | 
  'view_shift_report' | 'view_customers' | 'manage_customers' | 'view_settings' |
  'view_quotations' | 'manage_quotations' | 'view_staff' | 'manage_staff' | 'view_sales_history' |
  'view_timesheets' | 'manage_timesheets' | 'view_payment_summary' |
  'manage_returns' | 'manage_payouts' | 'manage_sales_orders' | 'manage_layaways' |
  'manage_work_orders' | 'view_held_receipts' | 'open_cash_drawer';


export type Role = 'Admin' | 'Cashier' | 'Supervisor' | 'Accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  pin?: string; // Optional 4-digit PIN for quick login
  // WARNING: For prototype purposes. In production, use a secure backend for password handling.
  password?: string;
  role: Role;
}

export interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface AuditLog {
    id: string;
    timestamp: Date;
    userId: string;
    userName: string;
    action: string;
    details: string;
}

export interface Payout {
  id: string;
  shiftId: string;
  cashierId: string;
  cashierName: string;
  date: Date;
  amount: number;
  reason: string;
  payee?: string;
}


export interface Shift {
    id: string;
    userId: string;
    userName: string;
    startTime: Date;
    endTime?: Date;
    status: 'active' | 'closed';
    startingFloat: number;
    salesIds: string[];
    payoutIds?: string[];
    // Populated on close
    paymentBreakdown?: { [key in Payment['method']]?: number };
    totalSales?: number;
    totalPayouts?: number;
    expectedCashInDrawer?: number;
    actualCashInDrawer?: number;
    cashVariance?: number;
}

export interface TimeClockEvent {
    id: string;
    userId: string;
    userName: string;
    clockInTime: Date;
    clockOutTime?: Date;
    status: 'clocked-in' | 'clocked-out';
    notes?: string;
}

export interface Settings {
    id: string; // Use a fixed ID for the single settings object
    isSetupComplete: boolean;
    businessType: BusinessType;
    businessInfo: {
        name: string;
        kraPin: string;
        logoUrl: string;
        location: string;
        phone: string;
        email?: string;
        branch?: string;
        currency: string;
        language: string;
    };
    tax: {
        vatEnabled: boolean;
        vatRate: number;
        pricingType: 'inclusive' | 'exclusive';
        etrEnabled: boolean;
    };
    discount: {
        enabled: boolean;
        type: 'percentage' | 'fixed';
        maxValue: number;
    };
    communication: {
        sms: {
            provider: 'none' | 'africastalking';
            username?: string;
            apiKey?: string;
            senderId?: string;
            useSandbox: boolean;
        };
        email: {
            mailer: 'smtp' | 'sendgrid' | 'mailgun';
            host?: string;
            port?: number;
            username?: string;
            password?: string;
            encryption?: 'none' | 'tls' | 'ssl';
            fromAddress?: string;
            fromName?: string;
        };
        whatsapp: {
            provider: 'none' | 'twilio' | 'meta';
            apiKey?: string;
            apiSecret?: string;
            senderPhoneNumber?: string;
        };
        mpesa: {
            enabled: boolean;
            environment: 'sandbox' | 'production';
            shortcode: string;
            consumerKey: string;
            consumerSecret: string;
            passkey: string;
            callbackUrl: string;
        };
    };
    receipt: {
        footer: string;
        invoicePrefix: string;
        quotePrefix: string;
        poNumberPrefix: string;
        layawayPrefix: string;
        workOrderPrefix: string;
        salesOrderPrefix: string;
    };
    hardware: {
        printer: {
            type: 'Browser' | 'ESC/POS';
            connection: 'USB' | 'Bluetooth' | 'Network';
            name?: string;
            address?: string;
            vendorId?: number;
            productId?: number;
        };
        barcodeScanner: {
            enabled: boolean;
        };
        barcodePrinter: {
            enabled: boolean;
            type: 'ZPL' | 'Image';
            connection: 'USB' | 'Bluetooth' | 'Network';
            name?: string;
        };
    };
    loyalty: {
        enabled: boolean;
        pointsPerKsh: number;
        redemptionRate: number;
        minRedeemablePoints: number;
        maxRedemptionPercentage: number;
    };
    measurements: {
        enabled: boolean;
        units: string[];
        templates: { name: string; fields: string[] }[];
    };
    permissions: {
        [key in Role]: Permission[];
    };
    paymentMethods: {
        enabled: boolean;
        displayOnDocuments: ('Invoice' | 'Quotation' | 'Proforma-Invoice' | 'Receipt')[];
        bank: { id: string; bankName: string; accountName: string; accountNumber: string; branch: string; }[];
        mpesaPaybill: {
            paybillNumber: string;
            accountNumber: string;
        };
        mpesaTill: {
            tillNumber: string;
        };
    };
}