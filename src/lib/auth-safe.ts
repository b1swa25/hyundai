export async function getServerSession() {
    // If we are in the build phase, return a mock session to avoid property access crashes
    // (e.g., session.user.role) during Next.js static evaluation/collection.
    // By using dynamic imports below, we also avoid loading the actual next-auth module during build.
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return {
            user: {
                id: 'build-time-mock',
                name: 'Build Mock',
                email: 'build@mock.test',
                role: 'ADMIN',
            }
        } as any;
    }

    try {
        const { getServerSession: nextAuthGetServerSession } = await import("next-auth/next");
        const { authOptions } = await import("@/auth");
        return await nextAuthGetServerSession(authOptions);
    } catch (e) {
        console.warn("[AUTH] getServerSession failed or skipped in this environment:", e);
        return null;
    }
}
