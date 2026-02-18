'use client';

import { useState } from 'react';
import { Package, Plus, Trash2, LayoutGrid, Search, AlertCircle } from 'lucide-react';
import AddPartModal from './AddPartModal';
import ConfirmationModal from './ConfirmationModal';
import Image from 'next/image';
import { deletePart } from '@/lib/actions';

interface PartsManagerProps {
    parts: any[];
    categories: any[];
}

export default function PartsManager({ parts, categories }: PartsManagerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [partToDelete, setPartToDelete] = useState<number | null>(null);

    const filteredParts = parts.filter(part =>
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async () => {
        if (partToDelete) {
            try {
                await deletePart(partToDelete);
                setPartToDelete(null);
            } catch (error) {
                console.error(error);
                alert('Failed to delete part.');
            }
        }
    };

    return (
        <>
            <div className="glass-card !p-8 space-y-8 border-white/5 border relative group">
                {/* Decorative Background - Isolated Overflow */}
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-hyundai-accent/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-hyundai-accent/10 flex items-center justify-center text-hyundai-accent">
                                <Package className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-widest text-white">Component Inventory</h3>
                        </div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-tight ml-13">Manage genuine parts and stock levels</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-grow lg:flex-grow-0 lg:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text"
                                placeholder="Search components..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs text-white placeholder:text-white/10 outline-none focus:border-hyundai-accent/40 focus:bg-white/[0.06] transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary !py-3 !px-6 !text-[10px] shadow-lg shadow-hyundai-blue/20 group/btn flex items-center gap-2"
                        >
                            <Plus size={14} className="group-hover/btn:rotate-90 transition-transform" />
                            Register Component
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
                    {filteredParts.map((part) => (
                        <div key={part.id} className="glass-card !p-4 flex gap-4 border-white/5 hover:border-hyundai-accent/30 transition-all group overflow-hidden">
                            <div className="w-20 h-20 bg-white/5 rounded-2xl flex-shrink-0 relative overflow-hidden">
                                {part.image ? (
                                    <Image
                                        src={part.image}
                                        alt={part.name}
                                        fill
                                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/5">
                                        <Package size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow flex flex-col justify-between min-w-0">
                                <div>
                                    <h4 className="text-sm font-black text-white truncate group-hover:text-hyundai-accent transition-colors">{part.name}</h4>
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-tight">{part.category?.name || 'Uncategorized'}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">Price</p>
                                        <p className="text-xs font-black text-hyundai-accent italic">Nu.{part.price.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${part.stock > 10 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {part.stock} IN STOCK
                                        </div>
                                        <button
                                            onClick={() => setPartToDelete(part.id)}
                                            className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredParts.length === 0 && (
                        <div className="col-span-full py-16 bg-white/[0.02] border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center text-white/10">
                                {searchTerm ? <Search size={32} /> : <AlertCircle size={32} />}
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black uppercase tracking-widest text-white/40">
                                    {searchTerm ? 'No matches found' : 'Inventory empty'}
                                </h4>
                                <p className="text-[10px] text-white/10 font-bold uppercase tracking-tight">
                                    {searchTerm ? 'Try adjusting your search criteria' : 'Register your first component to begin'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddPartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categories}
            />

            <ConfirmationModal
                isOpen={!!partToDelete}
                onClose={() => setPartToDelete(null)}
                onConfirm={handleDelete}
                title="Remove Component"
                message="Are you sure you want to remove this component from the inventory? This action cannot be undone."
                confirmText="Remove"
            />
        </>
    );
}
