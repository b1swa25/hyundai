import { Trash2, ExternalLink, ShieldCheck, Clock, CheckCircle2, XCircle, Wrench, Plus, Users as PeopleIcon } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getDb } from '@/db';
import { updateAppointmentStatus } from '@/lib/actions';
import { redirect } from 'next/navigation';
import ProfileHeader from '@/components/ProfileHeader';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    const db = getDb();
    const isAdmin = session.user.role === 'ADMIN';

    // Fetch user details from DB to get the latest phone and profile image
    const userData = await db.query.users.findFirst({
        where: (users: any, { eq }: any) => eq(users.id, session.user.id),
    });

    if (!userData) redirect('/login');

    const appointmentsData = isAdmin
        ? await db.query.appointments.findMany({
            with: { user: true, serviceType: true },
            orderBy: (appointments: any, { desc }: any) => [desc(appointments.createdAt)],
        })
        : await db.query.appointments.findMany({
            where: (appointments: any, { eq }: any) => eq(appointments.userId, session.user.id),
            with: { serviceType: true },
            orderBy: (appointments: any, { desc }: any) => [desc(appointments.createdAt)],
        });

    const stats = {
        total: appointmentsData.length,
        pending: appointmentsData.filter((a: any) => a.status === 'PENDING').length,
        completed: appointmentsData.filter((a: any) => a.status === 'COMPLETED').length,
    };

    const latestAnnouncement = isAdmin
        ? await db.query.announcements.findFirst({
            where: (announcements: any, { eq }: any) => eq(announcements.active, true),
            orderBy: (announcements: any, { desc }: any) => [desc(announcements.createdAt)],
        })
        : null;

    return (
        <div className="space-y-10">
            {/* Profile Header */}
            <ProfileHeader user={{
                id: userData.id,
                name: userData.username,
                email: userData.email,
                role: userData.role,
                phone: userData.phone,
                image: userData.profileImage
            }} />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Requests', value: stats.total, icon: Wrench, color: 'hyundai-accent' },
                    { label: 'Pending Service', value: stats.pending, icon: Clock, color: 'yellow-500' },
                    { label: 'Completed Jobs', value: stats.completed, icon: CheckCircle2, color: 'green-500' },
                ].map((stat, idx) => (
                    <div key={idx} className="glass-card !p-6 flex items-center gap-5 group hover:bg-white/[0.02]">
                        <div className={`p-4 rounded-xl bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                            <p className="text-2xl font-black mt-0.5">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-10">
                {/* Appointment List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-hyundai-accent/10 flex items-center justify-center text-hyundai-accent">
                                <Wrench className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-white">
                                    {isAdmin ? 'System-Wide Activity' : 'Your Service Records'}
                                </h2>
                                {isAdmin && (
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[8px] font-black uppercase tracking-tighter text-green-500/60">Live Monitor</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {!isAdmin && (
                            <Link href="/book" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-hyundai-accent transition-colors">
                                Book New Service →
                            </Link>
                        )}
                    </div>

                    <div className="space-y-4">
                        {appointmentsData.map((app: any) => (
                            <div key={app.id} className="glass-card !p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${app.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                        app.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500' :
                                            app.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-white/5 text-white/40'
                                        }`}>
                                        <Wrench className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-sm font-black uppercase tracking-tight">{app.serviceType.name}</h3>
                                            <div className={`mt-0.5 w-1.5 h-1.5 rounded-full animate-pulse ${app.status === 'PENDING' ? 'bg-yellow-500' :
                                                app.status === 'CONFIRMED' ? 'bg-green-500' :
                                                    'bg-blue-500'
                                                }`} />
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                                            <span>{app.date}</span>
                                            <span className="w-1 h-1 bg-white/10 rounded-full" />
                                            <span>{app.time}</span>
                                            {isAdmin && (
                                                <>
                                                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                                                    <span className="text-white/60 font-black">👤 {app.user?.username}</span>
                                                    {app.user?.phone && (
                                                        <span className="ml-2 px-2 py-0.5 rounded-md bg-hyundai-accent/20 text-hyundai-accent border border-hyundai-accent/30 text-[9px] flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2">
                                                            <span className="w-1 h-1 bg-hyundai-accent rounded-full animate-pulse" />
                                                            📞 {app.user.phone}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {isAdmin ? (
                                        <div className="flex gap-2 w-full">
                                            <form action={async () => {
                                                'use server';
                                                await updateAppointmentStatus(app.id, 'CONFIRMED');
                                            }} className="flex-1 md:flex-none">
                                                <button type="submit" className="w-full md:w-auto p-2.5 rounded-lg border border-white/5 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/20 transition-all">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                            <form action={async () => {
                                                'use server';
                                                await updateAppointmentStatus(app.id, 'CANCELLED');
                                            }} className="flex-1 md:flex-none">
                                                <button type="submit" className="w-full md:w-auto p-2.5 rounded-lg border border-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all">
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between w-full md:w-auto md:gap-4">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-md border tracking-widest uppercase ${app.status === 'PENDING' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' :
                                                app.status === 'CONFIRMED' ? 'border-green-500/30 text-green-500 bg-green-500/5' :
                                                    app.status === 'COMPLETED' ? 'border-blue-500/30 text-blue-500 bg-blue-500/5' :
                                                        'border-white/10 text-white/30'
                                                }`}>
                                                {app.status}
                                            </span>
                                            <button className="text-[10px] font-black text-hyundai-accent uppercase tracking-widest hover:underline px-2 py-1">Details</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {!isAdmin && (
                    <div className="glass-card !p-12 text-center space-y-6 relative overflow-hidden group max-w-2xl mx-auto border-hyundai-accent/10 border">
                        <div className="absolute inset-0 bg-gradient-to-br from-hyundai-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 space-y-4">
                            <div className="w-16 h-16 bg-hyundai-accent/10 rounded-2xl flex items-center justify-center mx-auto text-hyundai-accent group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="w-8 h-8 border-2 border-hyundai-accent rounded-full p-1.5" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-black uppercase tracking-widest">Need Support?</h3>
                                <p className="text-xs text-white/40 font-bold uppercase tracking-tight leading-relaxed max-w-sm mx-auto">
                                    Our service experts are available for technical assistance.
                                    Contact us for any electrical or mechanical concerns.
                                </p>
                            </div>
                            <div className="pt-4">
                                <button className="btn-primary !px-12 !py-4 !text-xs !font-black !tracking-[0.3em]">Contact Agency</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
