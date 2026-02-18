'use client';

import { Fragment, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDangerous = true,
}: ConfirmationModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="relative z-50">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div
                        className="w-full max-w-md transform overflow-hidden rounded-3xl bg-[#0a1425] border border-white/10 p-8 text-left align-middle shadow-2xl transition-all relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative Glow */}
                        <div className="absolute top-0 center left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-[64px] pointer-events-none" />

                        <div className="relative z-10">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6">
                                <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
                            </div>

                            <div className="text-center">
                                <h3 className="text-xl font-black uppercase tracking-widest text-white leading-6">
                                    {title}
                                </h3>
                                <div className="mt-4">
                                    <p className="text-sm text-white/60 font-medium leading-relaxed">
                                        {message}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3 justify-center">
                                <button
                                    type="button"
                                    className="inline-flex justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition-colors min-w-[100px]"
                                    onClick={onClose}
                                >
                                    {cancelText}
                                </button>
                                <button
                                    type="button"
                                    className={`inline-flex justify-center rounded-xl border border-transparent px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all min-w-[100px] ${isDangerous
                                            ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20 focus-visible:ring-red-500'
                                            : 'bg-hyundai-accent hover:bg-hyundai-blue shadow-hyundai-blue/20 focus-visible:ring-hyundai-accent'
                                        }`}
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
