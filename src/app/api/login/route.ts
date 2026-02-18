export const runtime = "edge";

import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { eq, and, or } from 'drizzle-orm';
import * as schema from '@/db/schema';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const db = getDb();

        // Check against mock/real DB - support both email and username
        const user = await db.query.users.findFirst({
            where: (users: any, { eq, and, or }: any) =>
                and(
                    or(
                        eq(users.email, email),
                        eq(users.username, email)
                    ),
                    eq(users.password, password)
                )
        });

        if (user) {
            // Return user info if authenticated
            return NextResponse.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            });
        }

        return new NextResponse('Invalid credentials', { status: 401 });
    } catch (error) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
