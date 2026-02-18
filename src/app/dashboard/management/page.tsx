export const runtime = "edge";

import { ShieldCheck, ChevronLeft, Users as PeopleIcon, Wrench, LayoutGrid, Bell, Package, Save, CheckCircle2, Sparkles, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getDb } from '@/db';
import { redirect } from 'next/navigation';
import { sql, eq, desc } from 'drizzle-orm';
import { users, parts, categories, appointments, announcements, successStories, employees as employeesTable } from '@/db/schema';
import AnnouncementEditor from '@/components/AnnouncementEditor';
import SuccessStoriesManager from '@/components/SuccessStoriesManager';
import TeamManager from '@/components/TeamManager';
import AddPartButton from '@/components/AddPartButton';

export const dynamic = 'force-dynamic';

export default async function ManagementPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') redirect('/dashboard');

    const db = getDb();

    // Fetch counts and datasets
    const [usersCount, partsCount, categoriesCount, appointmentsCount, announcementsCount, allStories, allEmployees, allCategories] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(users),
        db.select({ count: sql<number>`count(*)` }).from(parts),
        db.select({ count: sql<number>`count(*)` }).from(categories),
        db.select({ count: sql<number>`count(*)` }).from(appointments),
        db.select({ count: sql<number>`count(*)` }).from(announcements),
        db.query.successStories.findMany({
            orderBy: (successStories: any, { desc }: any) => [desc(successStories.createdAt)],
        }),
        db.query.employees.findMany({
            orderBy: (employees: any, { desc }: any) => [desc(employees.createdAt)],
        }),
        db.query.categories.findMany(),
    ]);

    const latestAnnouncement = await db.query.announcements.findFirst({
        where: (announcements: any, { eq }: any) => eq(announcements.active, true),
        orderBy: (announcements: any, { desc }: any) => [desc(announcements.createdAt)],
    });

    const stats = [
        { label: 'Users', value: usersCount[0].count, icon: PeopleIcon, color: 'blue-500' },
        { label: 'Parts', value: partsCount[0].count, icon: Package, color: 'hyundai-accent' },
        { label: 'Tasks', value: appointmentsCount[0].count, icon: Wrench, color: 'red-500' },
        { label: 'Stories', value: allStories.length, icon: Sparkles, color: 'amber-500' },
        { label: 'Alerts', value: announcementsCount[0].count, icon: Bell, color: 'purple-500' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black uppercase tracking-widest text-white">System <span className="text-hyundai-accent">Management</span></h1>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-tight">Advanced controls and administrative tools</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <AddPartButton categories={allCategories} />
                    <div className="hidden sm:flex w-12 h-12 bg-hyundai-accent/10 rounded-2xl items-center justify-center text-hyundai-accent">
                        <ShieldCheck className="w-6 h-6 border-2 border-hyundai-accent rounded-full p-1" />
                    </div>
                </div>
            </div>

            {/* System Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-card !p-4 flex flex-col items-center justify-center text-center gap-2 group hover:bg-white/[0.04] transition-all border border-white/5">
                        <div className={`p-2.5 rounded-lg bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={18} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{stat.label}</p>
                            <p className="text-lg font-black text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Management Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Inline Announcement Editor */}
                <div className="md:col-span-2">
                    <AnnouncementEditor
                        key={latestAnnouncement?.id || 'new'}
                        initialText={latestAnnouncement?.text || ''}
                    />
                </div>

                <div className="md:col-span-2">
                    <SuccessStoriesManager stories={allStories} />
                </div>
                <div className="md:col-span-2">
                    <TeamManager employees={allEmployees} />
                </div>
            </div>

            {/* Info Message */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 mt-1">
                    <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60">Administrator Notice</h4>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-tight leading-relaxed">
                        These tools are only accessible to accounts with ADMIN privileges.
                        Changes made here will be reflected instantly on the storefront and customer dashboards.
                    </p>
                </div>
            </div>
        </div>
    );
}
