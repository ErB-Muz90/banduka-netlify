// Type declarations for WebUSB API to fix TypeScript errors.
// In a real project, this would be handled by tsconfig.json "lib": ["webusb"] or by installing @types/w3c-web-usb.
declare global {
    interface USBDevice {
        readonly vendorId: number;
        readonly productId: number;
        readonly productName?: string;
        readonly configuration: USBConfiguration | null;
        open(): Promise<void>;
        close(): Promise<void>;
        reset(): Promise<void>;
        selectConfiguration(configurationValue: number): Promise<void>;
        claimInterface(interfaceNumber: number): Promise<void>;
        releaseInterface(interfaceNumber: number): Promise<void>;
        transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
    }

    interface USBConfiguration {
        readonly interfaces: ReadonlyArray<USBInterface>;
    }

    interface USBInterface {
        readonly alternates: ReadonlyArray<USBAlternateInterface>;
    }

    interface USBAlternateInterface {
        readonly endpoints: ReadonlyArray<USBEndpoint>;
    }

    interface USBEndpoint {
        readonly direction: 'in' | 'out';
        readonly endpointNumber: number;
    }

    interface USBOutTransferResult {
        readonly bytesWritten: number;
        readonly status: 'ok' | 'stall';
    }

    interface USB {
        getDevices(): Promise<USBDevice[]>;
        requestDevice(options?: { filters: any[] }): Promise<USBDevice>;
    }

    interface Navigator {
        readonly usb: USB;
    }
}

import { Sale, Settings } from '../types';

// --- WebUSB Device Management ---

let device: USBDevice | null = null;
let endpointNumber: number | null = null;

/**
 * Disconnects from the current device, releasing the interface.
 */
export async function disconnectDevice(): Promise<void> {
    if (device) {
        try {
            // It's important to release the interface before closing.
            await device.releaseInterface(0); // Assuming interface 0
            await device.close();
            console.log("Printer disconnected:", device.productName);
        } catch (error) {
            // Ignore errors on disconnect, as the device might already be gone.
            console.warn("Error during device disconnect (may be harmless):", error);
        } finally {
            device = null;
            endpointNumber = null;
        }
    }
}


/**
 * Requests a USB device from the user and establishes a connection.
 * @returns The connected USBDevice instance.
 * @throws If no device is selected or connection fails.
 */
export async function requestAndConnectDevice(): Promise<USBDevice> {
    await disconnectDevice(); // Disconnect any existing connection first.
    try {
        const selectedDevice = await navigator.usb.requestDevice({
            filters: [] // No filters to allow user to select any USB device initially
        });

        if (!selectedDevice) {
            throw new Error("No device selected.");
        }
        
        await selectedDevice.open();
        
        // Use the first configuration
        if (selectedDevice.configuration === null) {
            await selectedDevice.selectConfiguration(1);
        }

        // Try to reset the device to clear any OS-level holds
        try {
            await selectedDevice.reset();
        } catch (e) {
            console.warn("Could not reset device, continuing without reset.", e);
        }

        // Claim the first interface
        await selectedDevice.claimInterface(0);

        // Find the OUT endpoint
        const iface = selectedDevice.configuration?.interfaces[0];
        const outEndpoint = iface?.alternates[0].endpoints.find(e => e.direction === 'out');

        if (!outEndpoint) {
            throw new Error("Could not find an OUT endpoint on the printer.");
        }
        
        device = selectedDevice;
        endpointNumber = outEndpoint.endpointNumber;

        console.log("Printer connected:", device.productName);
        return device;

    } catch (error) {
        console.error("WebUSB connection error:", error);
        await disconnectDevice(); // Clean up on failure
        throw error;
    }
}

/**
 * Reconnects to a previously authorized device without user interaction.
 * @param vendorId - The vendor ID of the device to connect to.
 * @param productId - The product ID of the device to connect to.
 * @returns True if reconnection was successful, false otherwise.
 */
export async function reconnectDevice(vendorId: number, productId: number): Promise<boolean> {
    await disconnectDevice(); // Disconnect any existing connection first.
     try {
        const devices = await navigator.usb.getDevices();
        const foundDevice = devices.find(d => d.vendorId === vendorId && d.productId === productId);

        if (foundDevice) {
            await foundDevice.open();
            if (foundDevice.configuration === null) await foundDevice.selectConfiguration(1);
             // Try to reset the device to clear any OS-level holds
            try {
                await foundDevice.reset();
            } catch (e) {
                console.warn("Could not reset device on reconnect, continuing without reset.", e);
            }
            await foundDevice.claimInterface(0);
            const iface = foundDevice.configuration?.interfaces[0];
            const outEndpoint = iface?.alternates[0].endpoints.find(e => e.direction === 'out');
            if (!outEndpoint) throw new Error("Could not find OUT endpoint on reconnect.");
            
            device = foundDevice;
            endpointNumber = outEndpoint.endpointNumber;
            console.log("Reconnected to printer:", device.productName);
            return true;
        }
        return false;
    } catch (error) {
        console.error("WebUSB reconnection error:", error);
        await disconnectDevice(); // Clean up on failure
        return false;
    }
}

/**
 * Finds a previously permitted device without opening it.
 * @param vendorId The vendor ID of the device to find.
 * @param productId The product ID of the device to find.
 * @returns A USBDevice instance if found and permitted, otherwise null.
 */
export async function getPermittedDevice(vendorId: number, productId: number): Promise<USBDevice | null> {
    try {
        if (!navigator.usb) {
            console.warn("WebUSB is not supported by this browser.");
            return null;
        }
        const devices = await navigator.usb.getDevices();
        const foundDevice = devices.find(d => d.vendorId === vendorId && d.productId === productId);
        return foundDevice || null;
    } catch (error) {
        console.error("Error finding permitted device:", error);
        return null;
    }
}

// --- ESC/POS Command Generation ---

const encoder = new TextEncoder();

const ESC = 0x1B;
const GS = 0x1D;

const COMMANDS = {
    HW_INIT: [ESC, 0x40], // Initialize printer
    PAPER_FULL_CUT: [GS, 0x56, 0x00],
    CD_KICK_2: [ESC, 0x70, 0x00, 0x19, 0xFA], // Pin 2
    TXT_ALIGN_L: [ESC, 0x61, 0],
    TXT_ALIGN_C: [ESC, 0x61, 1],
    TXT_ALIGN_R: [ESC, 0x61, 2],
    TXT_BOLD_ON: [ESC, 0x45, 1],
    TXT_BOLD_OFF: [ESC, 0x45, 0],
    TXT_UNDERLINE_OFF: [ESC, 0x2D, 0],
    TXT_UNDERLINE_ON: [ESC, 0x2D, 1],
    TXT_FONT_A: [ESC, 0x4D, 0], // Default font
    TXT_FONT_B: [ESC, 0x4D, 1], // Smaller font
    TXT_NORMAL: [GS, 0x21, 0],
    TXT_2HEIGHT: [GS, 0x21, 0x10],
    TXT_2WIDTH: [GS, 0x21, 0x20],
};

/**
 * Sends raw data to the connected printer.
 * @param data - The Uint8Array of data to send.
 */
async function sendData(data: Uint8Array): Promise<USBOutTransferResult> {
    if (!device || !endpointNumber) {
        throw new Error("Printer is not connected.");
    }
    return device.transferOut(endpointNumber, data);
}

// --- Helpers ---
function combineCommands(...arrays: (Uint8Array | number[])[]): Uint8Array {
    const uint8Arrays = arrays.map(arr => arr instanceof Uint8Array ? arr : new Uint8Array(arr));
    const totalLength = uint8Arrays.reduce((acc, val) => acc + val.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    uint8Arrays.forEach(arr => {
        combined.set(arr, offset);
        offset += arr.length;
    });
    return combined;
}

function text(content: string): Uint8Array {
    return encoder.encode(content);
}

function createItemizedLine(name: string, quantity: number, price: number, width: number = 48): string {
    const totalPriceStr = (price * quantity).toFixed(2);
    const nameAndQty = `${name} (x${quantity})`;
    const nameMaxLength = width - totalPriceStr.length - 1;
    const truncatedNameAndQty = nameAndQty.length > nameMaxLength ? nameAndQty.substring(0, nameMaxLength) : nameAndQty;
    const line = truncatedNameAndQty.padEnd(width - totalPriceStr.length) + totalPriceStr;
    return line + '\n';
}

function createTotalLine(label: string, value: string, width: number = 48): string {
    return label.padEnd(width - value.length) + value + '\n';
}

function divider(char: string = '-', width: number = 48): string {
    return ''.padStart(width, char) + '\n';
}

/**
 * Creates a formatted receipt as a Uint8Array.
 * @param sale - The sale object.
 * @param settings - The application settings.
 * @param cashierName - The name of the cashier.
 * @returns A Uint8Array containing the full receipt commands.
 */
function buildReceipt(sale: Sale, settings: Settings, cashierName: string): Uint8Array {
    const receiptWidth = 48; // Assuming 80mm paper

    let commands = combineCommands(
        COMMANDS.HW_INIT,
        COMMANDS.TXT_ALIGN_C,
        COMMANDS.TXT_BOLD_ON,
        COMMANDS.TXT_2HEIGHT,
        text(settings.businessInfo.name + '\n'),
        COMMANDS.TXT_NORMAL,
        COMMANDS.TXT_BOLD_OFF,
        text(settings.businessInfo.location + '\n'),
        text(`Tel: ${settings.businessInfo.phone}\n`),
        text(`PIN: ${settings.businessInfo.kraPin}\n\n`),
        COMMANDS.TXT_ALIGN_L,
        text(divider('-', receiptWidth)),
        text(`Date: ${new Date(sale.date).toLocaleString('en-GB')}\n`),
        text(`Receipt: ${sale.id}\n`),
        text(`Cashier: ${cashierName}\n`),
        text(divider('-', receiptWidth)),
    );

    // Items
    let itemsCommands = text('');
    sale.items.forEach(item => {
        itemsCommands = combineCommands(
            itemsCommands,
            text(createItemizedLine(item.name, item.quantity, item.price, receiptWidth))
        );
    });
    commands = combineCommands(commands, itemsCommands, text(divider('-', receiptWidth)));

    // Totals
    const totalsCommands = combineCommands(
        text(createTotalLine('Subtotal', sale.subtotal.toFixed(2), receiptWidth)),
        sale.discountAmount > 0 ? text(createTotalLine('Discount', `-${sale.discountAmount.toFixed(2)}`, receiptWidth)) : new Uint8Array(),
        text(createTotalLine('VAT', sale.tax.toFixed(2), receiptWidth)),
        text(divider('=', receiptWidth)),
        COMMANDS.TXT_BOLD_ON,
        COMMANDS.TXT_2HEIGHT,
        // For double-height text, the effective width is halved.
        text(createTotalLine('TOTAL', `Ksh ${sale.total.toFixed(2)}`, receiptWidth / 2)),
        COMMANDS.TXT_NORMAL,
        COMMANDS.TXT_BOLD_OFF,
        text(divider('=', receiptWidth))
    );
    
    commands = combineCommands(commands, totalsCommands);

    // Payments
    let paymentsCommands = text('');
    sale.payments.forEach(p => {
        paymentsCommands = combineCommands(
            paymentsCommands,
            text(createTotalLine(p.method, p.amount.toFixed(2), receiptWidth))
        );
    });

    if (sale.change > 0) {
        paymentsCommands = combineCommands(
            paymentsCommands,
            COMMANDS.TXT_BOLD_ON,
            text(createTotalLine('Change', sale.change.toFixed(2), receiptWidth)),
            COMMANDS.TXT_BOLD_OFF
        );
    }
    
    commands = combineCommands(commands, paymentsCommands);

    // Footer
    const footerCommands = combineCommands(
        text('\n\n'),
        COMMANDS.TXT_ALIGN_C,
        text(settings.receipt.footer + '\n'),
        text('Goods once sold are not returnable.\n\n\n'),
        COMMANDS.PAPER_FULL_CUT
    );

    commands = combineCommands(commands, footerCommands);
    
    return commands;
}

/**
 * Generates receipt commands and sends them to the printer.
 * Also kicks the cash drawer.
 * @param sale - The sale to print.
 * @param settings - The application settings.
 * @param cashierName - The cashier's name.
 */
export async function printDirect(sale: Sale, settings: Settings, cashierName: string) {
    if (!device) throw new Error("Printer not connected");

    // 1. Kick the cash drawer
    await sendData(new Uint8Array(COMMANDS.CD_KICK_2));
    
    // 2. Build and print the receipt
    const receiptData = buildReceipt(sale, settings, cashierName);
    await sendData(receiptData);
}

/**
 * Sends a polished test print to the connected printer.
 */
export async function printTest() {
    if (!device) throw new Error("Printer not connected. Please connect via Hardware Settings.");
    
    const commands = combineCommands(
        COMMANDS.HW_INIT,
        COMMANDS.TXT_ALIGN_C,
        COMMANDS.TXT_BOLD_ON,
        COMMANDS.TXT_2HEIGHT,
        COMMANDS.TXT_2WIDTH,
        text("KenPOS\n"),
        COMMANDS.TXT_NORMAL,
        COMMANDS.TXT_BOLD_OFF,
        text("Printer Test\n"),
        text(divider('=', 48)),
        COMMANDS.TXT_ALIGN_L,
        text("This is a test print to confirm your\n"),
        text("printer is connected and working correctly.\n\n"),
        COMMANDS.TXT_BOLD_ON, text("Features:\n"), COMMANDS.TXT_BOLD_OFF,
        text("Default Text (Font A)\n"),
        new Uint8Array(COMMANDS.TXT_FONT_B), text("Smaller Text (Font B)\n"), new Uint8Array(COMMANDS.TXT_FONT_A),
        new Uint8Array(COMMANDS.TXT_UNDERLINE_ON), text("Underlined Text\n"), new Uint8Array(COMMANDS.TXT_UNDERLINE_OFF),
        text("\n"),
        COMMANDS.TXT_ALIGN_C, text("Centered Text\n"),
        COMMANDS.TXT_ALIGN_R, text("Right-Aligned Text\n"),
        COMMANDS.TXT_ALIGN_L,
        text(divider('=', 48)),
        COMMANDS.TXT_ALIGN_C,
        text("Connection Successful!\n\n\n"),
        COMMANDS.PAPER_FULL_CUT
    );

    await sendData(commands);
}
