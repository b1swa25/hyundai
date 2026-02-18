'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Phone, User, Loader2, CheckCircle2 } from 'lucide-react';
import { updateUserProfile } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        name: string | null | undefined;
        email: string | null | undefined;
        phone?: string | null;
        image?: string | null;
    };
}

export default function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [preview, setPreview] = useState<string | null>(user.image || null);
    const [phone, setPhone] = useState(user.phone || '');

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                onClose();
                setIsSuccess(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, onClose]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        try {
            await updateUserProfile(formData);
            setIsSuccess(true);
            router.refresh();
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="glass-card w-full max-w-md p-8 relative overflow-hidden group border-white/10 animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-hyundai-accent/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-hyundai-accent/10 flex items-center justify-center text-hyundai-accent">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Edit Profile</h2>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Update your contact info</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group/avatar">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center transform group-hover/avatar:scale-105 transition-transform duration-500">
                                {preview ? (
                                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-white/10" />
                                )}
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-300">
                                    <Upload className="w-6 h-6 text-white" />
                                    <input
                                        type="file"
                                        name="profileImage"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-hyundai-accent p-1.5 rounded-lg shadow-xl border-4 border-[#0a1425]">
                                <Upload className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Click to change picture</p>
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Contact Number</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                <Phone className="w-4 h-4" />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+975-..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-hyundai-accent/50 focus:bg-white/[0.05] transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || isSuccess}
                            className={`flex-[2] btn-primary !py-4 !text-[10px] !tracking-[0.2em] relative overflow-hidden group transition-all duration-500 ${isSuccess ? '!bg-green-500 !border-green-500 text-white' : ''}`}
                        >
                            <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${isPending || isSuccess ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                                Save Changes
                            </span>
                            {isPending && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                            )}
                            {isSuccess && (
                                <div className="absolute inset-0 flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2 duration-500">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Updated!</span>
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
