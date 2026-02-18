import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
// In-memory store for development mock data
const mockStore: any = {
    users: [
        {
            id: '1',
            username: 'admin',
            password: 'password123',
            email: 'admin@bhutanhyundai.bt',
            role: 'ADMIN',
            createdAt: new Date(),
        },
        {
            id: '2',
            username: 'customer',
            password: 'password123',
            email: 'customer@hyundai.test',
            role: 'CUSTOMER',
            phone: '+975 17889900',
            createdAt: new Date(),
        }
    ],
    announcements: [
        {
            id: 1,
            text: "Welcome to Bhutan Hyundai Motors. Genuine Spare Parts and Expert Service.",
            active: true,
            createdAt: new Date(),
        }
    ],
    parts: [
        {
            id: 1,
            name: "Brake Pads",
            description: "High performance genuine Hyundai brake pads.",
            price: 4500,
            stock: 20,
            categoryId: 1,
            image: "/images/parts/brake_pads.png",
            createdAt: new Date(),
            category: { name: "Brakes" }
        }
    ],
    categories: [
        { id: 1, name: "Brakes" },
        { id: 2, name: "Engine" }
    ],
    serviceTypes: [
        { id: 1, name: "Standard Alignment", basePrice: 1500 },
        { id: 2, name: "Brake Service", basePrice: 2500 }
    ],
    appointments: [],
    successStories: [
        {
            id: 1,
            title: "2024 Regional Excellence Award",
            description: "Bhutan Hyundai Motors was honored with the Regional Service Excellence Award for achieving highest customer satisfaction in the Thimphu region.",
            image: "/images/bhutan_hero.png",
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
        },
        {
            id: 2,
            title: "First EV Service Center in Bhutan",
            description: "We are proud to announce our certification as the first authorized service center for Hyundai's IONIQ and Kona Electric vehicle ranges in the kingdom.",
            image: "/images/hyundai_hero.png",
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
        }
    ],
    employees: [
        {
            id: 1,
            name: "Tashi Dorji",
            role: "Senior Automotive Electrician",
            bio: "Certified specialist with 15+ years experience in advanced electrical diagnostics and hybrid vehicle systems.",
            image: "/images/profiles/1-1771323626641-571276e93235e1b7c73cbdc55718782b.png",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            name: "Pema Lhamo",
            role: "Service Manager",
            bio: "Ensuring excellence in customer care and workshop management through professional leadership and automotive expertise.",
            image: "/images/profiles/1-1771323733114-571276e93235e1b7c73cbdc55718782b.png",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 3,
            name: "Karma Wangchuk",
            role: "Parts Specialist",
            bio: "Dedicated to sourcing and maintaining the highest quality of genuine Hyundai parts for Bhutanese roads.",
            image: "/images/profiles/1-1771323904994-571276e93235e1b7c73cbdc55718782b.png",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ],
};

const getTableName = (table: any) => {
    // Attempt to find table name from Drizzle symbols or stringification
    const name = table?.config?.name || table?.[Symbol.for('drizzle:Name')];
    if (name) return name;

    // Fallback regex matching for common Drizzle table string representations
    const str = table?.toString() || '';
    const match = str.match(/sqliteTable\("([^"]+)"/) || str.match(/table\("([^"]+)"/);
    if (match) return match[1];

    // Guess based on schema match if possible
    if (table === schema.users) return 'users';
    if (table === schema.parts) return 'parts';
    if (table === schema.categories) return 'categories';
    if (table === schema.serviceTypes) return 'service_types';
    if (table === schema.appointments) return 'appointments';
    if (table === schema.announcements) return 'announcements';
    if (table === schema.successStories) return 'successStories';
    if (table === schema.employees) return 'employees';

    return 'users';
};

export const getDb = (d1?: unknown) => {
    const db = d1 || (process.env.DB as any);

    if (!db) {
        console.warn('D1 Database binding "DB" not found. Using development mock data.');

        const createReturning = (data: any) => ({
            returning: async () => data === null ? [] : [data],
        });

        const genericFindFirst = async (tableName: string, options?: any) => {
            let items = [...(mockStore[tableName] || [])];

            if (options?.where) {
                const criteria = options.where.toString().toLowerCase();
                const idMatch = criteria.match(/["']?id["']?\s*=\s*["']([^"']+)["']/) || criteria.match(/eq\([a-zA-Z.]+\.id,\s*["']([^"']+)["']\)/);
                const id = idMatch?.[1] || options.where.right || options.where.value;

                if (id) return items.find((u: any) => u.id == id) || null;

                if (criteria.includes('active')) {
                    items = items.filter((i: any) => i.active === true);
                }
            }

            if (options?.orderBy && items.length > 0) {
                // Better mock sorting: extract field and direction if possible
                // Drizzle orderBy usually looks like [ { column: ..., direction: ... } ]
                const orderArr = Array.isArray(options.orderBy) ? options.orderBy : [options.orderBy];
                const order = orderArr[0];
                const field = order?.column?.name || 'id';
                const isDesc = order?.direction?.toLowerCase() === 'desc' || order?.toString().toLowerCase().includes('desc');

                items.sort((a: any, b: any) => {
                    const valA = a[field];
                    const valB = b[field];
                    if (valA instanceof Date && valB instanceof Date) {
                        return isDesc ? valB.getTime() - valA.getTime() : valA.getTime() - valB.getTime();
                    }
                    if (valA < valB) return isDesc ? 1 : -1;
                    if (valA > valB) return isDesc ? -1 : 1;
                    return 0;
                });
            }

            return items[0] || null;
        };

        const genericFindMany = async (tableName: string, options?: any) => {
            let items = [...(mockStore[tableName] || [])];

            if (options?.where) {
                const criteria = options.where.toString().toLowerCase();
                const userIdMatch = criteria.match(/userId\s*=\s*["']([^"']+)["']/);
                const userId = userIdMatch?.[1] || options.where.right || options.where.value;
                if (userId) items = items.filter((a: any) => a.userId == userId);

                if (criteria.includes('active')) {
                    items = items.filter((i: any) => i.active === true);
                }
            }

            if (options?.orderBy && items.length > 0) {
                const orderArr = Array.isArray(options.orderBy) ? options.orderBy : [options.orderBy];
                const order = orderArr[0];
                const field = order?.column?.name || 'id';
                const isDesc = order?.direction?.toLowerCase() === 'desc' || order?.toString().toLowerCase().includes('desc');

                items.sort((a: any, b: any) => {
                    const valA = a[field];
                    const valB = b[field];
                    if (valA instanceof Date && valB instanceof Date) {
                        return isDesc ? valB.getTime() - valA.getTime() : valA.getTime() - valB.getTime();
                    }
                    if (valA < valB) return isDesc ? 1 : -1;
                    if (valA > valB) return isDesc ? -1 : 1;
                    return 0;
                });
            }

            if (options?.limit) {
                const start = options.offset || 0;
                items = items.slice(start, start + options.limit);
            }

            return items;
        };

        // Return a mock that uses the in-memory store
        return {
            query: {
                announcements: {
                    findFirst: (opt: any) => genericFindFirst('announcements', opt),
                    findMany: (opt: any) => genericFindMany('announcements', opt),
                },
                parts: {
                    findMany: (opt: any) => genericFindMany('parts', opt),
                    findFirst: (opt: any) => genericFindFirst('parts', opt),
                },
                categories: {
                    findMany: (opt: any) => genericFindMany('categories', opt),
                    findFirst: (opt: any) => genericFindFirst('categories', opt),
                },
                serviceTypes: {
                    findMany: (opt: any) => genericFindMany('serviceTypes', opt),
                    findFirst: (opt: any) => genericFindFirst('serviceTypes', opt),
                },
                users: {
                    findFirst: async (options?: { where: any }) => {
                        if (!options?.where) return mockStore.users[0];

                        const criteria = options.where.toString();
                        const idMatch = criteria.match(/["']?id["']?\s*=\s*["']([^"']+)["']/) || criteria.match(/eq\([a-zA-Z.]+\.id,\s*["']([^"']+)["']\)/);
                        const usernameMatch = criteria.match(/["']?username["']?\s*=\s*["']([^"']+)["']/) || criteria.match(/eq\([a-zA-Z.]+\.username,\s*["']([^"']+)["']\)/);

                        const id = idMatch?.[1] || (options.where as any)?.right || (options.where as any)?.value;
                        const username = usernameMatch?.[1] || id;

                        if (id || username) {
                            const found = mockStore.users.find((u: any) => u.id == id || u.username == username);
                            if (found) return found;
                        }

                        return mockStore.users[0];
                    },
                    findMany: (opt: any) => genericFindMany('users', opt),
                },
                appointments: {
                    findMany: async (options?: any) => {
                        if (options?.where) {
                            const criteria = options.where.toString();
                            const userIdMatch = criteria.match(/userId\s*=\s*["']([^"']+)["']/);
                            const userId = userIdMatch?.[1] || options.where.right || options.where.value;
                            if (userId) return mockStore.appointments.filter((a: any) => a.userId == userId);
                        }
                        return mockStore.appointments;
                    },
                    findFirst: (opt: any) => genericFindFirst('appointments', opt),
                },
                successStories: {
                    findMany: (opt: any) => genericFindMany('successStories', opt),
                    findFirst: (opt: any) => genericFindFirst('successStories', opt),
                },
                employees: {
                    findMany: (opt: any) => genericFindMany('employees', opt),
                    findFirst: (opt: any) => genericFindFirst('employees', opt),
                }
            },
            select: (fields?: any) => ({
                from: (table: any) => {
                    const tableName = getTableName(table);
                    const items = mockStore[tableName] || [];

                    // If fields contains a 'count' key, return the count format
                    const result = (fields && fields.count)
                        ? [{ count: items.length }]
                        : items;

                    return {
                        where: () => ({
                            then: (resolve: any) => resolve(result),
                        }),
                        then: (resolve: any) => resolve(result),
                    } as any;
                },
            }),
            insert: (table: any) => ({
                values: (data: any) => {
                    const tableName = getTableName(table);
                    let newItem = { ...data };
                    if (mockStore[tableName]) {
                        if (!newItem.id) {
                            newItem.id = tableName === 'users' ? 'user_' + Date.now() : Math.floor(Math.random() * 10000);
                        }
                        mockStore[tableName].push(newItem);
                    }
                    return createReturning(newItem);
                }
            }),
            update: (table: any) => ({
                set: (updateData: any) => ({
                    where: (whereClause: any) => {
                        const tableName = getTableName(table);
                        const criteria = whereClause.toString().toLowerCase();

                        // Handle id=X or eq(id, X) - supporting both quoted and raw numbers
                        const idMatch = criteria.match(/["']?id["']?\s*=\s*["']?([^"']\d*)["']?/) ||
                            criteria.match(/eq\([a-zA-Z.]+\.id,\s*["']?([^"'\s)]+)["']?\)/);
                        const id = idMatch?.[1] || whereClause.right || whereClause.value;

                        // Handle active=true or eq(active, true)
                        const isActiveQuery = criteria.includes('active') && (criteria.includes('true') || whereClause.value === true);

                        if (mockStore[tableName]) {
                            if (id) {
                                // Update by ID
                                const index = mockStore[tableName].findIndex((item: any) => item.id == id);
                                if (index !== -1) {
                                    mockStore[tableName][index] = { ...mockStore[tableName][index], ...updateData };
                                    return createReturning(mockStore[tableName][index]);
                                }
                            } else if (isActiveQuery) {
                                // Bulk update active items (specifically for announcements)
                                mockStore[tableName].forEach((item: any, index: number) => {
                                    if (item.active === true) {
                                        mockStore[tableName][index] = { ...item, ...updateData };
                                    }
                                });
                                return createReturning({}); // Dummy return
                            }
                        }
                        return createReturning(null);
                    }
                })
            }),
            delete: (table: any) => ({
                where: (whereClause: any) => {
                    const tableName = getTableName(table);
                    const criteria = whereClause.toString();
                    const idMatch = criteria.match(/["']?id["']?\s*=\s*["']([^"']+)["']/) || criteria.match(/eq\([a-zA-Z.]+\.id,\s*["']([^"']+)["']\)/);
                    const id = idMatch?.[1] || whereClause.right || whereClause.value;

                    let deletedItem = null;
                    if (id && mockStore[tableName]) {
                        const index = mockStore[tableName].findIndex((item: any) => item.id == id);
                        if (index !== -1) {
                            deletedItem = mockStore[tableName].splice(index, 1)[0];
                        }
                    }
                    return createReturning(deletedItem);
                }
            }),
        } as any;
    }

    return drizzle(db, { schema });
};
