export const runtime = "edge";

export async function GET(req: any) {
    if (process.env.NEXT_PHASE === 'phase-production-build') return new Response("OK");
    const { default: NextAuth } = await import("next-auth");
    const { authOptions } = await import("@/auth");
    return NextAuth(authOptions)(req);
}

export async function POST(req: any) {
    if (process.env.NEXT_PHASE === 'phase-production-build') return new Response("OK");
    const { default: NextAuth } = await import("next-auth");
    const { authOptions } = await import("@/auth");
    return NextAuth(authOptions)(req);
}
