export const runtime = 'edge';

import AdminPortal from '@/components/AdminPortal';
import { getServerSession } from '@/lib/auth-safe';
import { redirect } from 'next/navigation';

export default async function AdminPage({ params }: { params: Promise<{ admin?: string[] }> }) {
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') redirect('/dashboard');

    await params;
    return <AdminPortal />;
}
