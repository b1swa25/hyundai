'use client';

import { useState } from 'react';
import { Users as TeamIcon, Plus, LayoutGrid } from 'lucide-react';
import AddEmployeeModal from './AddEmployeeModal';
import EmployeeCard from './EmployeeCard';

interface TeamManagerProps {
    employees: any[];
}

export default function TeamManager({ employees }: TeamManagerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="glass-card !p-8 space-y-8 border-white/5 border relative group">
                {/* Decorative Background - Isolated Overflow */}
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <TeamIcon className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-widest text-white">Expert Team</h3>
                        </div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-tight ml-13">Directly manage your expert roster</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary !py-3 !px-6 !text-[10px] shadow-lg shadow-hyundai-blue/20 group/btn flex items-center gap-2"
                    >
                        <Plus size={14} className="group-hover/btn:rotate-90 transition-transform" />
                        Add Team Member
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {employees.map((employee) => (
                        <EmployeeCard key={employee.id} employee={employee} isAdmin={true} />
                    ))}

                    {employees.length === 0 && (
                        <div className="col-span-full py-20 bg-white/[0.02] border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center text-white/10">
                                <LayoutGrid size={32} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black uppercase tracking-widest text-white/40">No Team Members Listed</h4>
                                <p className="text-[10px] text-white/10 font-bold uppercase tracking-tight">Click the button above to add your first expert</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
