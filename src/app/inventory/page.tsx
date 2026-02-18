export const runtime = "edge";

import { getServerSession } from '@/lib/auth-safe';
import { getDb } from '@/db';
import { categories as categoriesTable } from '@/db/schema';
import InventoryClient from '@/components/InventoryClient';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
    const db = getDb();
    const session = await getServerSession();
    const isAdmin = session?.user?.role === 'ADMIN';

    const [allParts, categoriesData] = await Promise.all([
        db.query.parts.findMany({
            with: {
                category: true,
            },
            orderBy: (parts: any, { desc }: any) => [desc(parts.createdAt)],
        }),
        db.select().from(categoriesTable)
    ]);

    return (
        <InventoryClient
            parts={allParts}
            categories={categoriesData}
            isAdmin={isAdmin}
        />
    );
}
