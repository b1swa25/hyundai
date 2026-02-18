'use client';

import { useState, useTransition, useEffect } from 'react';
import { Save, CheckCircle2, Loader2, Bell, Trash2, XCircle } from 'lucide-react';
import { upsertAnnouncement, clearAllAnnouncements } from '@/lib/actions';

interface AnnouncementEditorProps {
    initialText: string;
}

export default function AnnouncementEditor({ initialText }: AnnouncementEditorProps) {
    const [text, setText] = useState(initialText);
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    // Sync state when initialText changes (e.g., after revalidatePath)
    useEffect(() => {
        setText(initialText);
    }, [initialText]);

    const handleUpdate = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!text || text.trim() === '') return;

        setSuccess(false);
        startTransition(async () => {
            try {
                await upsertAnnouncement(text);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } catch (error) {
                console.error("Failed to update announcement:", error);
            }
        });
    };

    const handleClear = async () => {
        setIsClearing(true);
        startTransition(async () => {
            try {
                await clearAllAnnouncements();
                setText('');
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } catch (error) {
                console.error("Failed to clear announcements:", error);
            } finally {
                setIsClearing(false);
            }
        });
    };

    const hasChanges = text !== initialText;

    return (
        <div className="glass-card !p-8 space-y-6 relative overflow-hidden group border-hyundai-accent/20 border">
            <div className="absolute inset-0 bg-gradient-to-br from-hyundai-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-hyundai-accent/10 rounded-lg text-hyundai-accent">
                            <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/80">Announcement</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${initialText ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
                                    {initialText ? 'Status: ONLINE' : 'Status: OFFLINE'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {success && (
                        <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Update Live!</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-end px-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-hyundai-accent/80">Draft Editor</label>
                            {hasChanges && (
                                <span className="text-[8px] font-bold text-yellow-500/80 uppercase italic tracking-tight italic">Unpublished Changes*</span>
                            )}
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={3}
                            placeholder="Type a new announcement for the storefront..."
                            className={`w-full bg-white/5 border rounded-xl p-4 text-[11px] text-white font-medium transition-all outline-none resize-none placeholder:text-white/20 ${hasChanges ? 'border-hyundai-accent/40 bg-hyundai-accent/5 ring-1 ring-hyundai-accent/20' : 'border-white/10'}`}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={() => handleUpdate()}
                            disabled={isPending || !hasChanges && !success}
                            className="btn-primary !py-3.5 !text-[10px] !font-black !tracking-[0.15em] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending && !isClearing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Save className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            )}
                            {isPending && !isClearing ? 'PUBLISHING...' : 'SAVE & PUBLISH'}
                        </button>

                        <button
                            onClick={handleClear}
                            disabled={isPending || !initialText}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl !py-3.5 !text-[10px] !font-black !tracking-[0.15em] flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {isPending && isClearing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <XCircle className="w-3.5 h-3.5" />
                            )}
                            CLEAR ANNOUNCEMENT
                        </button>
                    </div>
                </div>

                <div className={`mt-2 p-3 rounded-xl border ${initialText ? 'bg-white/5 border-white/10 opacity-80' : 'bg-white/[0.02] border-white/5 opacity-40 italic'}`}>
                    <div className="flex items-center gap-2 mb-1.5 opacity-60">
                        <CheckCircle2 className={`w-3 h-3 ${initialText ? 'text-green-500' : 'text-white/40'}`} />
                        <span className="text-[8px] font-black uppercase tracking-widest leading-none">Live Now on Storefront</span>
                    </div>
                    <p className="text-[9px] text-white/70 font-medium leading-relaxed">
                        {initialText ? `"${initialText}"` : 'Deactivated - No announcement currently visible to users.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
