'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddPartModal from './AddPartModal';

interface AddPartButtonProps {
    categories: { id: number; name: string }[];
}

export default function AddPartButton({ categories }: AddPartButtonProps) {
    const [isIdOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-primary !p-3 flex items-center gap-2 border-white/10 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20"
            >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-black uppercase tracking-tighter">Add Part</span>
            </button>

            <AddPartModal
                isOpen={isIdOpen}
                onClose={() => setIsOpen(false)}
                categories={categories}
            />
        </>
    );
}
