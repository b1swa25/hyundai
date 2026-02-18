export const runtime = "edge";

import { getDb } from '@/db';
import { bookAppointment } from '@/lib/actions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export default async function BookService() {
    const db = getDb();
    const serviceTypes = await db.query.serviceTypes.findMany();
    const session = await getServerSession(authOptions);

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold uppercase tracking-tight">Book <span className="accent-text">Service</span></h1>
                <p className="opacity-70">Schedule your professional automotive electrical inspection.</p>
            </div>

            <div className="glass-card space-y-6">
                <form action={async (formData) => {
                    'use server';
                    if (!session?.user?.id) return;
                    await bookAppointment(formData, session.user.id);
                }} className="space-y-6">

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 opacity-80">Service Type</label>
                            <select name="serviceType" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-hyundai-accent appearance-none transition-all">
                                {serviceTypes.map((type: any) => (
                                    <option key={type.id} value={type.id} className="bg-bg-dark">{type.name} (Nu. {type.basePrice})</option>
                                ))}

                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 opacity-80">Preferred Date</label>
                                <input name="date" type="date" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-hyundai-accent transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 opacity-80">Preferred Time</label>
                                <input name="time" type="time" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-hyundai-accent transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 opacity-80">Additional Notes</label>
                            <textarea
                                name="notes"
                                rows={4}
                                placeholder="Tell us about the issue you're experiencing..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-hyundai-accent transition-all"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-4 text-center">Confirm Booking Request</button>
                </form>
            </div>
        </div>
    );
}
