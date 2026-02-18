'use client';

import { useState, useRef } from 'react';
import { X, Upload, Check, Loader2, UserPlus } from 'lucide-react';
import { createEmployee } from '@/lib/actions';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const action = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            await createEmployee(formData);
            onClose();
            setPreview(null);
            formRef.current?.reset();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#000814]/80 backdrop-blur-[12px]" onClick={onClose} />

            <div className="glass-card w-full max-w-2xl relative z-10 overflow-hidden border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-500 rounded-[2.5rem] max-h-[90vh] overflow-y-auto">
                {/* Subtle Accent Glow */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                <div className="p-8 lg:p-12">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                                <UserPlus className="w-6 h-6 text-blue-500" />
                                Recruit Expert
                            </h2>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Enrolling Service Frontiers</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form ref={formRef} action={action} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Side: Professional Portrait */}
                            <div className="space-y-6">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Professional Portrait</label>
                                <label className="relative flex flex-col items-center justify-center w-full aspect-square rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/30 cursor-pointer transition-all overflow-hidden group">
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Profile Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="w-6 h-6 text-white" />
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Update Portrait</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                                                <Upload className="w-5 h-5 text-white/20 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] group-hover:text-white/40">Select High-Res Image</p>
                                        </div>
                                    )}
                                    <input type="file" name="image" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>

                            {/* Right Side: Identity & Role */}
                            <div className="space-y-6 flex flex-col justify-center">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Expert Identity</label>
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Core Expertise</label>
                                    <input
                                        required
                                        name="role"
                                        type="text"
                                        placeholder="e.g., Master Technician"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Experience Narrative */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Experience Narrative</label>
                            <textarea
                                name="bio"
                                rows={3}
                                placeholder="A brief chronicle of their contribution..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all resize-none leading-relaxed"
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
                                disabled={isSubmitting}
                                className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.4em] relative overflow-hidden group/btn disabled:opacity-50 transition-all border border-blue-400/20 shadow-xl shadow-blue-600/20"
                            >
                                <span className={`flex items-center justify-center gap-3 transition-transform duration-500 ${isSubmitting ? '-translate-y-16' : 'translate-y-0'}`}>
                                    <Check size={16} />
                                    Confirm Enrollment
                                </span>
                                {isSubmitting && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 animate-spin text-white" />
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
