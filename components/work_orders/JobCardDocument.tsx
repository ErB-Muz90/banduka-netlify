import React from 'react';
import { WorkOrder, User, Settings } from '../../types';

interface JobCardDocumentProps {
    workOrder: WorkOrder;
    users: User[];
    settings: Settings;
}

const JobCardDocument = React.forwardRef<HTMLDivElement, JobCardDocumentProps>(({ workOrder, users, settings }, ref) => {
    const assignedTechnician = users.find(u => u.id === workOrder.assignedToId);

    return (
        <div ref={ref} className="bg-white p-8 font-sans text-sm text-black w-full max-w-4xl mx-auto shadow-lg border">
            {/* Header */}
            <header className="flex justify-between items-start pb-4 border-b">
                <div>
                    {settings.businessInfo.logoUrl && (
                        <img src={settings.businessInfo.logoUrl} alt="Company Logo" className="h-16 max-w-xs object-contain mb-4"/>
                    )}
                    <h2 className="text-xl font-bold text-slate-800">{settings.businessInfo.name}</h2>
                    <p className="text-slate-600">{settings.businessInfo.location}</p>
                    <p className="text-slate-600">Tel: {settings.businessInfo.phone}</p>
                    <p className="text-slate-600">PIN: {settings.businessInfo.kraPin}</p>
                </div>
                <div className="text-right">
                    <h1 className="text-3xl font-bold uppercase text-slate-700 tracking-wide">Job Card</h1>
                    <div className="mt-2 text-xs">
                        <p className="flex justify-end gap-2"><span className="text-slate-500">Job Card #:</span> <span className="font-semibold">{workOrder.id}</span></p>
                        <p className="flex justify-end gap-2"><span className="text-slate-500">Date:</span> <span className="font-semibold">{new Date(workOrder.createdDate).toLocaleDateString('en-GB', {timeZone: 'Africa/Nairobi'})}</span></p>
                    </div>
                </div>
            </header>

            {/* Customer Details */}
            <section className="mt-8">
                <h3 className="text-xs uppercase font-bold text-slate-500 mb-2">Customer Details</h3>
                <p className="font-bold text-slate-800">{workOrder.customerName}</p>
            </section>
            
            {/* Service Details */}
            <section className="mt-8">
                 <h3 className="text-xs uppercase font-bold text-slate-500 mb-2">Service Details</h3>
                 <div className="p-3 border rounded-md">
                    <p><span className="font-semibold">Item to be Serviced:</span> {workOrder.itemToService}</p>
                    <p className="mt-2"><span className="font-semibold">Customer Complaint / Description of Work:</span></p>
                    <p className="text-slate-600 whitespace-pre-wrap pl-2">{workOrder.descriptionOfWork}</p>
                 </div>
            </section>

             {/* Technician's Report */}
            <section className="mt-8">
                <h3 className="text-xs uppercase font-bold text-slate-500 mb-2">Technician's Report / Work Done</h3>
                <div className="h-40 border rounded-md p-2 text-slate-600">
                    {/* This space is intentionally left blank for handwritten notes on the printed copy */}
                </div>
            </section>
            
            {/* Sign Off */}
            <section className="mt-16 pt-8 border-t">
                <p className="text-xs text-center text-slate-600">I, the undersigned, confirm that the service described above has been completed to my satisfaction.</p>
                <div className="mt-8 grid grid-cols-2 gap-12 text-sm">
                    <div>
                        <div className="border-b border-black pb-1"></div>
                        <p className="mt-2 font-semibold">Client Name & Signature</p>
                    </div>
                    <div>
                        <div className="border-b border-black pb-1">{assignedTechnician?.name || ''}</div>
                        <p className="mt-2 font-semibold">Technician Name & Signature</p>
                    </div>
                     <div>
                        <div className="border-b border-black pb-1"></div>
                        <p className="mt-2 font-semibold">Date</p>
                    </div>
                    <div>
                         <div className="border-b border-black pb-1">{new Date().toLocaleDateString('en-GB', {timeZone: 'Africa/Nairobi'})}</div>
                        <p className="mt-2 font-semibold">Date</p>
                    </div>
                </div>
            </section>

             {/* Footer */}
            <footer className="mt-16 pt-4 border-t text-xs text-slate-500 text-center">
                <p>{settings.receipt.footer}</p>
            </footer>
        </div>
    );
});

export default JobCardDocument;
