const path = require('path');
const { getDb } = require(path.join(process.cwd(), 'src/db/index.ts'));
const { announcements } = require(path.join(process.cwd(), 'src/db/schema.ts'));
const { desc, eq } = require('drizzle-orm');

async function check() {
    try {
        const db = getDb();
        const active = await db.select().from(announcements).where(eq(announcements.active, true)).orderBy(desc(announcements.createdAt));
        console.log('ACTIVE ANNOUNCEMENTS:');
        console.log(JSON.stringify(active, null, 2));

        const latest = await db.select().from(announcements).orderBy(desc(announcements.createdAt)).limit(5);
        console.log('LATEST 5 ANNOUNCEMENTS:');
        console.log(JSON.stringify(latest, null, 2));
    } catch (e) {
        console.error(e);
    }
}

check();
