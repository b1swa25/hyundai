'use client';

export const runtime = "edge";

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="max-w-md mx-auto space-y-8 py-12">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold uppercase tracking-tight">Welcome <span className="accent-text">Back</span></h1>
                <p className="opacity-70">Enter your credentials to access your portal.</p>
            </div>

            <div className="glass-card">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setError(null);
                        const formData = new FormData(e.currentTarget);
                        const result = await signIn('credentials', {
                            username: formData.get('username'),
                            password: formData.get('password'),
                            redirect: false,
                        });

                        if (result?.error) {
                            setError('Invalid credentials or access error.');
                        } else {
                            window.location.href = '/dashboard';
                        }
                    }}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 opacity-80">Username</label>
                            <input name="username" type="text" placeholder="username" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-hyundai-accent transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 opacity-80">Password</label>
                            <input name="password" type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-hyundai-accent transition-all" />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-3">Enter Portal</button>
                </form>

                <p className="text-center text-sm mt-6 opacity-60">
                    New to Bhutan Hyundai? <Link href="/register" className="text-hyundai-accent hover:underline">Join Us</Link>
                </p>
            </div>
        </div>
    );
}
