import { getDb } from './src/db';
import { parts } from './src/db/schema';
import { sql } from 'drizzle-orm';

async function test() {
    try {
        console.log('Testing Mock DB...');
        const db = getDb();

        console.log('Testing select count...');
        const countResult = await db.select({ count: sql`count(*)` }).from(parts);
        console.log('Count Result:', JSON.stringify(countResult));

        console.log('Testing query.parts.findMany...');
        const items = await db.query.parts.findMany({
            limit: 10,
            offset: 0,
        });
        console.log('Items found:', items.length);

        console.log('Testing query.parts.findFirst...');
        const item = await db.query.parts.findFirst({
            where: (t: any, { eq }: any) => eq(t.id, 1)
        });
        console.log('Item found:', item?.name);

        console.log('Test completed successfully!');
    } catch (error) {
        console.error('Test failed with error:', error);
    }
}

test();
