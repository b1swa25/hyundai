export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { users, categories, parts, serviceTypes, appointments, announcements } from '@/db/schema';
import { eq, sql, desc, asc, and } from 'drizzle-orm';
import { getServerSession } from '@/lib/auth-safe';
const SCHEMA_MAP: Record<string, any> = {
    users,
    categories,
    parts,
    serviceTypes,
    appointments,
    announcements,
};

async function checkAdmin(req: NextRequest) {
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
        return false;
    }
    return true;
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug?: string[] }> }
) {
    try {
        if (!(await checkAdmin(req))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    } catch (e) {
        console.error('Auth check error:', e);
        return NextResponse.json({ error: 'Auth check failed' }, { status: 500 });
    }

    const db = getDb();
    const { slug } = await params;
    const [resource, id] = slug || [];

    if (!resource || !SCHEMA_MAP[resource]) {
        return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    const table = SCHEMA_MAP[resource];
    console.log(`API GET: resource=${resource}, id=${id}, hasTable=${!!table}`);

    // Single item
    if (id) {
        const item = await db.query[resource].findFirst({
            where: eq(table.id, isNaN(Number(id)) ? id : Number(id)),
            with: resource === 'parts' ? { category: true } :
                resource === 'appointments' ? { user: true, serviceType: true } : undefined
        });

        if (!item) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return NextResponse.json(item);
    }

    // List items
    const { searchParams } = new URL(req.url);
    const sortParams = JSON.parse(searchParams.get('sort') || '["id", "ASC"]');
    const rangeParams = JSON.parse(searchParams.get('range') || '[0, 9]');
    const filterParams = JSON.parse(searchParams.get('filter') || '{}');

    const [sortField, sortOrder] = sortParams;
    const [start, end] = rangeParams;

    const limit = end - start + 1;
    const offset = start;

    try {
        console.log(`API GET List: ${resource} count start`);
        const countResult = await db.select({ count: sql<number>`count(*)` }).from(table);
        const total = countResult[0].count;
        console.log(`API GET List: ${resource} count=${total}`);

        const items = await db.query[resource].findMany({
            limit,
            offset,
            orderBy: sortOrder === 'DESC' ? desc(table[sortField]) : asc(table[sortField]),
            with: resource === 'parts' ? { category: true } :
                resource === 'appointments' ? { user: true, serviceType: true } : undefined
        });

        return new NextResponse(JSON.stringify(items), {
            headers: {
                'Content-Range': `${resource} ${start}-${end}/${total}`,
                'Access-Control-Expose-Headers': 'Content-Range',
                'Content-Type': 'application/json',
            },
        });
    } catch (e: any) {
        console.error(`API GET List error for ${resource}:`, e);
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug?: string[] }> }
) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const { slug } = await params;
    const [resource] = slug || [];
    const table = SCHEMA_MAP[resource];

    if (!resource || !table) {
        return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    const body = await req.json() as any;

    // Add ID if it's text-based and missing
    if (table.id?.name === 'id' && !body.id) {
        body.id = crypto.randomUUID();
    }

    if (!body.createdAt) body.createdAt = new Date();
    if (table.updatedAt && !body.updatedAt) body.updatedAt = new Date();

    const result = await db.insert(table).values(body).returning();
    if (!result || result.length === 0) return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
    return NextResponse.json(result[0]);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ slug?: string[] }> }
) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const { slug } = await params;
    const [resource, id] = slug || [];
    const table = SCHEMA_MAP[resource];

    if (!resource || !table || !id) {
        return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    const body = await req.json() as any;
    if (table.updatedAt) body.updatedAt = new Date();

    // Remove relation objects before update
    delete body.category;
    delete body.user;
    delete body.serviceType;

    const result = await db.update(table)
        .set(body)
        .where(eq(table.id, isNaN(Number(id)) ? id : Number(id)))
        .returning();

    if (!result || result.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(result[0]);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ slug?: string[] }> }
) {
    if (!(await checkAdmin(req))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const { slug } = await params;
    const [resource, id] = slug || [];
    const table = SCHEMA_MAP[resource];

    if (!resource || !table || !id) {
        return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    const result = await db.delete(table)
        .where(eq(table.id, isNaN(Number(id)) ? id : Number(id)))
        .returning();

    if (!result || result.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(result[0]);
}
