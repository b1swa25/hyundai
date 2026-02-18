'use client';

import { useState } from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import EditProfileModal from './EditProfileModal';

interface ProfileHeaderProps {
    user: {
        id: string;
        name: string | null | undefined;
        email: string | null | undefined;
        role: string;
        phone?: string | null;
        image?: string | null;
    };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <>
            <div className="glass-card flex flex-col md:flex-row justify-between items-center gap-6 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-hyundai-accent/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-hyundai-accent/10 transition-colors duration-700" />

                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-hyundai-blue to-hyundai-accent flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform overflow-hidden shadow-2xl">
                            {user.image ? (
                                <img src={user.image} alt={user.name || 'Profile'} className="w-full h-full object-cover -rotate-3 group-hover:-rotate-6 transition-transform" />
                            ) : (
                                <ShieldCheck className="w-10 h-10 text-white -rotate-3 group-hover:-rotate-6 transition-transform" />
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#0a1425] rounded-full" />
                    </div>

                    <div className="text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <h1 className="text-2xl font-black tracking-tight uppercase">{user.name}</h1>
                            <span className="bg-hyundai-accent/10 text-hyundai-accent text-[9px] font-black px-3 py-1 rounded-md border border-hyundai-accent/20 tracking-widest uppercase">
                                {user.role}
                            </span>
                        </div>
                        <p className="text-sm text-white/40 font-medium tracking-wide mt-1">{user.email}</p>
                        {user.phone && (
                            <p className="text-[10px] text-hyundai-accent/60 font-black uppercase tracking-tighter mt-1">📞 {user.phone}</p>
                        )}
                        {user.role === 'ADMIN' && (
                            <Link
                                href="/dashboard/management"
                                className="flex items-center gap-2 text-[10px] text-hyundai-accent font-black uppercase tracking-widest mt-3 hover:underline group/cp"
                            >
                                <ExternalLink className="w-3 h-3 group-hover/cp:translate-x-0.5 group-hover/cp:-translate-y-0.5 transition-transform" />
                                Control Panel
                            </Link>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative z-10 btn-primary !py-2 !px-6 !text-[11px] shadow-lg shadow-hyundai-blue/20"
                >
                    Edit Profile
                </button>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={{
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    image: user.image
                }}
            />
        </>
    );
}
