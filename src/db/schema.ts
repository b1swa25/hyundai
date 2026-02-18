import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: text('role', { enum: ['ADMIN', 'CUSTOMER'] }).default('CUSTOMER').notNull(),
    phone: text('phone'),
    address: text('address'),
    profileImage: text('profile_image'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    appointments: many(appointments),
    partsAdded: many(parts),
}));

export const categories = sqliteTable('categories', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    parts: many(parts),
}));

export const parts = sqliteTable('parts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description').notNull(),
    price: real('price').notNull(),
    stock: integer('stock').default(0).notNull(),
    image: text('image'),
    categoryId: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
    addedBy: text('added_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const partsRelations = relations(parts, ({ one }) => ({
    category: one(categories, {
        fields: [parts.categoryId],
        references: [categories.id],
    }),
    addedByUser: one(users, {
        fields: [parts.addedBy],
        references: [users.id],
    }),
}));

export const serviceTypes = sqliteTable('service_types', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description').notNull(),
    estimatedDuration: text('estimated_duration').notNull(), // Store as string for simplicity
    basePrice: real('base_price').notNull(),
});

export const serviceTypesRelations = relations(serviceTypes, ({ many }) => ({
    appointments: many(appointments),
}));

export const appointments = sqliteTable('appointments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    serviceTypeId: integer('service_type_id').references(() => serviceTypes.id, { onDelete: 'cascade' }).notNull(),
    date: text('date').notNull(), // YYYY-MM-DD
    time: text('time').notNull(), // HH:MM
    status: text('status', { enum: ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] }).default('PENDING').notNull(),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const appointmentsRelations = relations(appointments, ({ one }) => ({
    user: one(users, {
        fields: [appointments.userId],
        references: [users.id],
    }),
    serviceType: one(serviceTypes, {
        fields: [appointments.serviceTypeId],
        references: [serviceTypes.id],
    }),
}));

export const announcements = sqliteTable('announcements', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    text: text('text').notNull(),
    active: integer('active', { mode: 'boolean' }).default(true).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
export const successStories = sqliteTable('success_stories', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    image: text('image'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const employees = sqliteTable('employees', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    role: text('role').notNull(),
    image: text('image'),
    bio: text('bio'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
