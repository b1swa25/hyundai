export const runtime = 'edge';

import AdminPortal from '@/components/AdminPortal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage({ params }: { params: Promise<{ admin?: string[] }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') redirect('/dashboard');

    await params;
    return <AdminPortal />;
}
