export const runtime = "edge";
import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const context = getRequestContext();
        const envKeys = context?.env ? Object.keys(context.env) : [];
        const envExists = !!context?.env;
        const dbExists = !!(context?.env as any)?.DB;

        return NextResponse.json({
            status: 'ok',
            message: 'Diagnostic check',
            cloudflare: {
                envExists,
                dbExists,
                availableBindings: envKeys,
            },
            processEnv: {
                DB_EXISTS: !!process.env.DB,
                NODE_ENV: process.env.NODE_ENV,
            }
        });
    } catch (e: any) {
        return NextResponse.json({
            status: 'error',
            error: e.message,
            stack: e.stack
        }, { status: 500 });
    }
}
