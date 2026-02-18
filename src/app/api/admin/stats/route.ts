export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { users, parts, categories, appointments, announcements } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();

    try {
        const usersCount = await db.select({ count: sql<number>`count(*)` }).from(users);
        const partsCount = await db.select({ count: sql<number>`count(*)` }).from(parts);
        const categoriesCount = await db.select({ count: sql<number>`count(*)` }).from(categories);
        const appointmentsCount = await db.select({ count: sql<number>`count(*)` }).from(appointments);
        const activeAnnouncementsCount = await db.select({ count: sql<number>`count(*)` }).from(announcements);

        const latestAnnouncement = await db.query.announcements.findFirst({
            where: (announcements: any, { eq }: any) => eq(announcements.active, true),
            orderBy: (announcements: any, { desc }: any) => [desc(announcements.createdAt)],
        });

        return NextResponse.json({
            users: usersCount[0].count,
            parts: partsCount[0].count,
            categories: categoriesCount[0].count,
            appointments: appointmentsCount[0].count,
            activeAnnouncements: activeAnnouncementsCount[0].count,
            latestAnnouncement: latestAnnouncement,
        });
    } catch (error: any) {
        console.error('Stats API error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
