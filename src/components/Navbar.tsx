'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

export default function Navbar({ user }: { user?: { name?: string | null, email?: string | null, image?: string | null, role: string } }) {


    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/[0.03] backdrop-blur-2xl border-b border-white/10 py-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 text-2xl font-black italic tracking-tighter group transition-transform hover:scale-105">
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-md rounded-full group-hover:bg-hyundai-accent/40 transition-all"></div>
                        <Image
                            src="/images/hyundai_logo_spinner.png"
                            alt="Hyundai Logo"
                            width={42}
                            height={42}
                            className="relative z-10 brightness-110"
                        />
                    </div>
                    <span className="text-white brightness-125 drop-shadow-md tracking-[0.1em]">HYUNDAI</span>
                </Link>

                <div className="hidden md:flex gap-10 items-center font-bold">
                    <Link href="/" className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white transition-all">Home</Link>
                    <Link href="/inventory" className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white transition-all">Inventory</Link>
                    {!user || user.role !== 'ADMIN' ? (
                        <Link href="/book" className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white transition-all">Book Service</Link>
                    ) : null}

                    {user ? (
                        <>
                            <Link href="/dashboard" className="text-xs uppercase tracking-[0.2em] text-hyundai-accent hover:text-white transition-all flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-hyundai-accent animate-pulse"></div>
                                {user.role === 'ADMIN' ? 'Admin Hub' : 'My Account'}
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all font-black"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white transition-all">Enter</Link>
                            <Link href="/register" className="btn-primary !py-2.5 !px-6 !text-[10px] !tracking-[0.25em] shadow-lg shadow-hyundai-blue/50">Join Us</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
