import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import JsBarcode from 'jsbarcode';
import { Product } from '../../types';

interface BarcodePrintModalProps {
    product: Product;
    onClose: () => void;
}

const BarcodePrintModal: React.FC<BarcodePrintModalProps> = ({ product, onClose }) => {
    const [barcodeType, setBarcodeType] = useState<'sku' | 'ean'>(product.ean ? 'ean' : 'sku');
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(12);
    const [labelWidth, setLabelWidth] = useState(40);
    const [labelHeight, setLabelHeight] = useState(30);
    const [columns, setColumns] = useState(2);
    const [fontSize, setFontSize] = useState(8);

    const codeToPrint = useMemo(() => (barcodeType === 'ean' && product.ean) ? product.ean : product.sku, [barcodeType, product]);

    useEffect(() => {
        // This effect will run after the component renders with the new quantity of SVGs
        setError(null);
        if (codeToPrint) {
            try {
                JsBarcode('.barcode-svg', codeToPrint, {
                    format: barcodeType === 'ean' && product.ean ? "EAN13" : "CODE128",
                    displayValue: true,
                    fontSize: 14,
                    margin: 2,
                    height: 30,
                    width: 1.5,
                    valid: (valid) => {
                        if (!valid) {
                            setError(`The provided ${barcodeType.toUpperCase()} is not valid for this barcode type.`);
                        }
                    }
                });
            } catch (e: any) {
                console.error("Barcode generation failed:", e);
                setError(e.message || `Failed to generate ${barcodeType.toUpperCase()} barcode.`);
            }
        } else {
             setError(`No ${barcodeType.toUpperCase()} code available for this product.`);
        }
    }, [codeToPrint, barcodeType, quantity, columns, labelWidth, labelHeight]);
    
    const handlePrint = () => {
        window.print();
    };

    return (
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col dark:bg-slate-800"
            >
                <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Print Barcode Labels</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                    <div className="w-full md:w-80 flex-shrink-0 p-6 space-y-4 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">Print Settings</h3>
                        {product.ean && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Barcode Type</label>
                                <div className="mt-1 flex justify-center bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                    <button onClick={() => setBarcodeType('sku')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors w-1/2 ${barcodeType === 'sku' ? 'bg-white dark:bg-slate-600 text-emerald-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>SKU</button>
                                    <button onClick={() => setBarcodeType('ean')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors w-1/2 ${barcodeType === 'ean' ? 'bg-white dark:bg-slate-600 text-emerald-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>EAN</button>
                                </div>
                            </div>
                        )}
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantity to Print</label>
                            <input id="quantity" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" />
                        </div>
                        <div>
                            <label htmlFor="columns" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Columns per Row</label>
                            <input id="columns" type="number" value={columns} onChange={e => setColumns(Number(e.target.value))} min="1" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" />
                        </div>
                         <div>
                            <label htmlFor="labelWidth" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Label Width (mm)</label>
                            <input id="labelWidth" type="number" value={labelWidth} onChange={e => setLabelWidth(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" />
                        </div>
                         <div>
                            <label htmlFor="labelHeight" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Label Height (mm)</label>
                            <input id="labelHeight" type="number" value={labelHeight} onChange={e => setLabelHeight(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" />
                        </div>
                        <div>
                            <label htmlFor="fontSize" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Font Size (pt)</label>
                            <input id="fontSize" type="number" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" />
                        </div>
                    </div>
                    <div className="flex-grow p-4 overflow-auto bg-slate-200 dark:bg-slate-900">
                        {error ? (
                            <div className="h-full flex items-center justify-center text-red-500 font-semibold text-sm p-4 text-center">
                               {error}
                            </div>
                        ) : (
                             <div id="barcode-to-print" style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                                gap: '1mm',
                                justifyItems: 'center'
                            }}>
                                {Array.from({ length: quantity }).map((_, index) => (
                                    <div key={index} style={{
                                        width: `${labelWidth}mm`,
                                        height: `${labelHeight}mm`,
                                        padding: '1mm',
                                        border: '1px dashed #ccc',
                                        boxSizing: 'border-box',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        pageBreakInside: 'avoid',
                                        backgroundColor: 'white',
                                        overflow: 'hidden'
                                    }}>
                                        <p className="text-black font-bold text-center" style={{ fontSize: `${fontSize}pt`, lineHeight: 1.1, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{product.name}</p>
                                        <p className="text-black font-semibold text-center" style={{ fontSize: `${fontSize - 1}pt`, lineHeight: 1.1, margin: 0 }}>Ksh {product.price.toFixed(2)}</p>
                                        <svg className="barcode-svg" style={{maxWidth: '100%', height: 'auto'}}></svg>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0 mt-auto flex justify-end space-x-3 p-6 border-t border-slate-200 dark:border-slate-700">
                    <motion.button type="button" onClick={onClose} whileTap={{ scale: 0.95 }} className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-lg hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</motion.button>
                    <motion.button onClick={handlePrint} disabled={!!error} whileTap={{ scale: 0.95 }} className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-md flex items-center disabled:bg-slate-400 disabled:cursor-not-allowed">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h1v-4a1 1 0 011-1h10a1 1 0 011 1v4h1a2 2 0 002-2v-6a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                        Print Labels
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BarcodePrintModal;