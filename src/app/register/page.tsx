export const runtime = "edge";

'use client';

import Link from 'next/link';
import { registerUser } from '@/lib/actions';

export default function RegisterPage() {
    return (
        <div className="max-w-xl mx-auto space-y-8 py-12">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold uppercase tracking-tight">Join the <span className="accent-text">Community</span></h1>
                <p className="opacity-70">Create an account for personalized service and inventory updates.</p>
            </div>

            <div className="glass-card">
                <form action={registerUser} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 opacity-80">Username</label>
                                <input name="username" type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-hyundai-accent transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 opacity-80">Email</label>
                                <input name="email" type="email" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-hyundai-accent transition-all" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 opacity-80">Phone</label>
                                <input name="phone" type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-hyundai-accent transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 opacity-80">Address</label>
                                <input name="address" type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-hyundai-accent transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 opacity-80">Password</label>
                            <input name="password" type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-hyundai-accent transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 opacity-80">Confirm Password</label>
                            <input name="confirmPassword" type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-hyundai-accent transition-all" />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-4 text-center">Create Member Account</button>
                </form>

                <p className="text-center text-sm mt-6 opacity-60">
                    Already a member? <Link href="/login" className="text-hyundai-accent hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
