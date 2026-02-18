'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddSuccessStoryModal from './AddSuccessStoryModal';

export default function AddStoryButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-primary !p-3 flex items-center gap-2 border-white/10 bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-900/20"
            >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-black uppercase tracking-tighter">Add Milestone</span>
            </button>

            <AddSuccessStoryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
