import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ToastData } from '../../types';
import { ICONS } from '../../constants';

interface PaymentMethodsSettingsProps {
    settings: Settings;
    onUpdateSettings: (settings: Partial<Settings>) => void;
    showToast: (message: string, type: ToastData['type']) => void;
}

const InputField: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }> = ({ label, name, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
        <input
            type="text"
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
    </div>
);

const PaymentMethodsSettings: React.FC<PaymentMethodsSettingsProps> = ({ settings, onUpdateSettings, showToast }) => {
    const [formData, setFormData] = useState(settings.paymentMethods);

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, enabled: e.target.checked }));
    };

    const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const docType = value as 'Invoice' | 'Quotation' | 'Proforma-Invoice' | 'Receipt';
        
        setFormData(prev => {
            const currentDocs = prev.displayOnDocuments;
            if (checked) {
                return { ...prev, displayOnDocuments: [...currentDocs, docType] };
            } else {
                return { ...prev, displayOnDocuments: currentDocs.filter(d => d !== docType) };
            }
        });
    };

    const handleBankChange = (id: string, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            bank: prev.bank.map(b => b.id === id ? { ...b, [field]: value } : b)
        }));
    };

    const handleAddBank = () => {
        setFormData(prev => ({
            ...prev,
            bank: [...prev.bank, { id: crypto.randomUUID(), bankName: '', accountName: '', accountNumber: '', branch: '' }]
        }));
    };

    const handleRemoveBank = (id: string) => {
        setFormData(prev => ({ ...prev, bank: prev.bank.filter(b => b.id !== id) }));
    };

    const handleMpesaChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'mpesaPaybill' | 'mpesaTill') => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [type]: { ...prev[type], [name]: value }
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateSettings({ paymentMethods: formData });
        showToast('Payment methods saved successfully!', 'success');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Display Payment Methods on Documents</span>
                <label htmlFor="payment-methods-toggle" className="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" name="enabled" checked={formData.enabled} onChange={handleToggle} id="payment-methods-toggle" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
            </div>
            
            <AnimatePresence>
                {formData.enabled && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 overflow-hidden"
                    >
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Display On:</label>
                            <div className="flex flex-wrap gap-4">
                                {(['Receipt', 'Quotation', 'Proforma-Invoice'] as const).map(doc => (
                                    <label key={doc} className="flex items-center">
                                        <input type="checkbox" value={doc} checked={formData.displayOnDocuments.includes(doc)} onChange={handleDisplayChange} className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-slate-300 rounded" />
                                        <span className="ml-2 text-sm text-slate-700">{doc.replace('-', ' ')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* M-PESA */}
                        <div className="pt-4 border-t">
                            <h4 className="font-semibold text-slate-800 mb-2">M-Pesa Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg">
                                    <p className="font-medium text-slate-600 mb-2">Paybill</p>
                                    <InputField label="Paybill Number" name="paybillNumber" value={formData.mpesaPaybill.paybillNumber} onChange={e => handleMpesaChange(e, 'mpesaPaybill')} />
                                    <InputField label="Account Number / Instructions" name="accountNumber" value={formData.mpesaPaybill.accountNumber} onChange={e => handleMpesaChange(e, 'mpesaPaybill')} placeholder="e.g. Your Name"/>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <p className="font-medium text-slate-600 mb-2">Buy Goods (Till)</p>
                                    <InputField label="Till Number" name="tillNumber" value={formData.mpesaTill.tillNumber} onChange={e => handleMpesaChange(e, 'mpesaTill')} />
                                </div>
                            </div>
                        </div>

                        {/* BANK */}
                        <div className="pt-4 border-t">
                            <h4 className="font-semibold text-slate-800 mb-2">Bank Accounts</h4>
                            <div className="space-y-4">
                                {formData.bank.map((b, index) => (
                                    <div key={b.id} className="p-4 bg-slate-50 rounded-lg border relative">
                                        <button type="button" onClick={() => handleRemoveBank(b.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">&times;</button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputField label="Bank Name" name={`bankName-${index}`} value={b.bankName} onChange={e => handleBankChange(b.id, 'bankName', e.target.value)} />
                                            <InputField label="Account Name" name={`accountName-${index}`} value={b.accountName} onChange={e => handleBankChange(b.id, 'accountName', e.target.value)} />
                                            <InputField label="Account Number" name={`accountNumber-${index}`} value={b.accountNumber} onChange={e => handleBankChange(b.id, 'accountNumber', e.target.value)} />
                                            <InputField label="Branch" name={`branch-${index}`} value={b.branch} onChange={e => handleBankChange(b.id, 'branch', e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <motion.button type="button" onClick={handleAddBank} whileTap={{ scale: 0.95 }} className="mt-4 bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm">
                                Add Bank Account
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-end pt-6 border-t border-slate-200 mt-6">
                 <motion.button type="submit" whileTap={{ scale: 0.95 }} className="bg-emerald-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-md">
                    Save Payment Settings
                </motion.button>
            </div>
        </form>
    );
};

export default PaymentMethodsSettings;
