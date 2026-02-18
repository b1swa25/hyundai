'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Package, Loader2, CheckCircle2, ListTree, Plus as PlusIcon } from 'lucide-react';
import { addPart } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface AddPartModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: { id: number; name: string }[];
}

export default function AddPartModal({ isOpen, onClose, categories }: AddPartModalProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setPreview(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, onClose]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        try {
            await addPart(formData);
            setIsSuccess(true);
            router.refresh();
        } catch (error) {
            console.error('Failed to add part:', error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#000814]/80 backdrop-blur-[12px]" onClick={onClose} />

            <div className="glass-card w-full max-w-2xl relative z-10 overflow-hidden border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-500 rounded-[2.5rem] max-h-[90vh] overflow-y-auto">
                {/* Subtle Accent Glow */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-hyundai-accent/50 to-transparent" />

                <div className="p-8 lg:p-12">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                                <Package className="w-6 h-6 text-hyundai-accent" />
                                Register Component
                            </h2>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Inventory Management Registry</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Side: Image Asset */}
                            <div className="space-y-6">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Asset Visualization</label>
                                <label className="relative flex flex-col items-center justify-center w-full aspect-square rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-hyundai-accent/30 cursor-pointer transition-all overflow-hidden group">
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="w-6 h-6 text-white" />
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Exchange Visual</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-hyundai-accent/10 transition-colors">
                                                <Upload className="w-5 h-5 text-white/20 group-hover:text-hyundai-accent transition-colors" />
                                            </div>
                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] group-hover:text-white/40">Select Visual Asset</p>
                                        </div>
                                    )}
                                    <input type="file" name="image" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>

                            {/* Right Side: Primary Identity */}
                            <div className="space-y-6 flex flex-col justify-center">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Archive Title</label>
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        placeholder="e.g., Performance Brake Hub"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 outline-none focus:border-hyundai-accent/40 focus:bg-white/[0.06] transition-all"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Classification</label>
                                    <div className="relative">
                                        <select
                                            required
                                            name="categoryId"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white appearance-none outline-none focus:border-hyundai-accent/40 focus:bg-white/[0.06] transition-all cursor-pointer"
                                        >
                                            <option value="" className="bg-[#0a1425]">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id} className="bg-[#0a1425]">{cat.name}</option>
                                            ))}
                                        </select>
                                        <ListTree className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-hyundai-accent pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Parameters */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Financial Valuation (Nu.)</label>
                                <input
                                    required
                                    type="number"
                                    name="price"
                                    placeholder="0"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-hyundai-accent/40 focus:bg-white/[0.06] transition-all"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Current Stock Integrity</label>
                                <input
                                    required
                                    type="number"
                                    name="stock"
                                    placeholder="0"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-hyundai-accent/40 focus:bg-white/[0.06] transition-all"
                                />
                            </div>
                        </div>

                        {/* Technical Narrative */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Technical Specification Archive</label>
                            <textarea
                                required
                                name="description"
                                rows={3}
                                placeholder="Detail the technical parameters and vehicle compatibility..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 outline-none focus:border-hyundai-accent/40 focus:bg-white/[0.06] transition-all resize-none leading-relaxed"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                disabled={isPending || isSuccess}
                                className={`flex-[2] py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] relative overflow-hidden group/btn transition-all duration-500 shadow-xl shadow-hyundai-blue/20 border border-hyundai-accent/20 ${isSuccess ? 'bg-green-500 text-white border-green-400/30' : 'bg-hyundai-blue hover:bg-hyundai-blue/90 text-white'}`}
                            >
                                <span className={`flex items-center justify-center gap-3 transition-transform duration-500 ${isPending || isSuccess ? '-translate-y-16' : 'translate-y-0'}`}>
                                    <Package size={16} />
                                    Commit Registry
                                </span>
                                {isPending && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 animate-spin text-hyundai-accent" />
                                    </span>
                                )}
                                {isSuccess && (
                                    <span className="absolute inset-0 flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2 duration-500">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Certified
                                    </span>
                                )}
                                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover/btn:animate-shine" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
