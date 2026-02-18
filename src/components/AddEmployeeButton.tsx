'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddEmployeeModal from './AddEmployeeModal';

export default function AddEmployeeButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-primary !p-3 flex items-center gap-2 border-white/10 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20"
            >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-black uppercase tracking-tighter">Add Expert</span>
            </button>

            <AddEmployeeModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
