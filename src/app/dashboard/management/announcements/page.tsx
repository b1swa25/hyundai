export const runtime = "edge";

import { ShieldCheck, ChevronLeft, Bell, Save, History, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getDb } from '@/db';
import { redirect } from 'next/navigation';
import { upsertAnnouncement } from '@/lib/actions';
import { announcements } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export default async function AnnouncementManagerPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') redirect('/dashboard');

    const db = getDb();
    const latestAnnouncements = await db.select().from(announcements).orderBy(desc(announcements.createdAt)).limit(5);
    const activeAnnouncement = latestAnnouncements.find((a: any) => a.active);

    async function handleUpdate(formData: FormData) {
        'use server';
        const text = formData.get('text') as string;
        if (!text || text.trim() === '') return;
        await upsertAnnouncement(text);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/management"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black uppercase tracking-widest text-white">Announcement <span className="text-hyundai-accent">Manager</span></h1>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-tight">Direct storefront messaging control</p>
                    </div>
                </div>
                <div className="w-12 h-12 bg-hyundai-accent/10 rounded-2xl flex items-center justify-center text-hyundai-accent">
                    <Bell className="w-6 h-6 animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Editor Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card !p-8 border-hyundai-accent/20 border relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="text-[9px] font-black uppercase tracking-widest text-hyundai-accent bg-hyundai-accent/10 px-3 py-1 rounded-full">Live Editor</span>
                        </div>

                        <form action={handleUpdate} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-white/60 block px-1">Message Text</label>
                                <textarea
                                    name="text"
                                    rows={4}
                                    defaultValue={activeAnnouncement?.text || ''}
                                    placeholder="Enter the message you want customers to see on the home page..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm font-medium focus:ring-2 focus:ring-hyundai-accent/50 focus:border-hyundai-accent/50 transition-all outline-none resize-none placeholder:text-white/20"
                                />
                                <p className="text-[10px] text-white/20 font-bold uppercase tracking-tight px-1 italic">
                                    Tip: Keep it concise and impactful. This appears at the top of the storefront.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full !py-5 !text-xs !font-black !tracking-[0.2em] flex items-center justify-center gap-3 group"
                            >
                                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                UPDATE STOREFRONT NOW
                            </button>
                        </form>
                    </div>

                    {/* Active Status Info */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-5">
                        <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-white/80">Current Live Message</h4>
                            <p className="text-sm text-white/40 italic font-medium leading-relaxed">
                                "{activeAnnouncement?.text || 'No active announcement set yet.'}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* History Sidebar */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-white/40 px-2">
                        <History className="w-4 h-4" />
                        <h2 className="text-[10px] font-black uppercase tracking-widest">Recent History</h2>
                    </div>

                    <div className="space-y-3">
                        {latestAnnouncements.map((ann: any) => (
                            <div key={ann.id} className={`glass-card !p-4 border transition-all ${ann.active ? 'border-hyundai-accent/30 bg-hyundai-accent/5' : 'border-white/5 opacity-60'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">
                                        {new Date(ann.createdAt).toLocaleDateString()}
                                    </span>
                                    {ann.active && (
                                        <span className="text-[8px] font-black text-hyundai-accent uppercase tracking-widest animate-pulse">Active</span>
                                    )}
                                </div>
                                <p className="text-[10px] text-white/60 font-medium line-clamp-2 leading-relaxed">
                                    "{ann.text}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
