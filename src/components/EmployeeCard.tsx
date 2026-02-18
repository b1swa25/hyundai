'use client';

import { useState } from 'react';
import { User, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { deleteEmployee } from '@/lib/actions';
import ConfirmationModal from './ConfirmationModal';

interface EmployeeCardProps {
    employee: {
        id: number;
        name: string;
        role: string;
        image?: string | null;
        bio?: string | null;
    };
    isAdmin?: boolean;
}

export default function EmployeeCard({ employee, isAdmin }: EmployeeCardProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = async () => {
        await deleteEmployee(employee.id);
    };

    return (
        <>
            <div className="glass-card flex flex-col items-center text-center p-8 group border-white/5 hover:border-hyundai-accent/30 transition-all duration-500 relative overflow-hidden">
                {/* Decorative Polish */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-hyundai-accent/40 to-transparent" />

                {/* Action Overlay */}
                {isAdmin && (
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg backdrop-blur-md border border-red-500/20 transition-all z-20 opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}

                {/* Profile Photo */}
                <div className="relative w-28 h-28 mb-6">
                    <div className="absolute inset-0 bg-hyundai-accent/20 rounded-full blur-2xl group-hover:bg-hyundai-accent/40 transition-colors duration-700" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-hyundai-accent/50 transition-colors duration-500 bg-white/5 flex items-center justify-center">
                        {employee.image ? (
                            <Image
                                src={employee.image}
                                alt={employee.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        ) : (
                            <User className="w-12 h-12 text-white/10" />
                        )}
                    </div>
                </div>

                {/* Employee Details */}
                <div className="space-y-2">
                    <h4 className="text-lg font-black uppercase tracking-widest text-white group-hover:text-hyundai-accent transition-colors">
                        {employee.name}
                    </h4>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-hyundai-accent">
                            {employee.role}
                        </span>
                    </div>
                    {employee.bio && (
                        <p className="text-[11px] text-white/40 font-bold uppercase tracking-tight leading-relaxed max-w-[200px] mt-2 line-clamp-2">
                            {employee.bio}
                        </p>
                    )}
                </div>

                {/* Hover Indicator */}
                <div className="mt-8">
                    <div className="h-0.5 w-8 bg-white/10 group-hover:w-16 group-hover:bg-hyundai-accent transition-all duration-700 mx-auto" />
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Remove Team Member"
                message={`Are you sure you want to remove ${employee.name} from the team? This action cannot be undone.`}
                confirmText="Remove"
            />
        </>
    );
}
