'use server';

import { getDb } from '@/db';
import { users, appointments, parts, announcements, successStories, employees } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// import { writeFile } from 'fs/promises';
// import path from 'path';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/auth';

// Temporary mock for session until Edge compatibility is resolved
const getServerSession = async (...args: any[]) => null as any;
const authOptions: any = {};

// Auth Actions
export async function registerUser(formData: FormData) {
    const db = getDb();
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;

    // In a real app, hash the password!
    await db.insert(users).values({
        id: globalThis.crypto.randomUUID(),
        username,
        email,
        password, // TODO: Hash this
        phone,
        address,
        role: 'CUSTOMER',
        createdAt: new Date(),
    });

    revalidatePath('/login');
    redirect('/login');
}

// Appointment Actions
export async function bookAppointment(formData: FormData, userId: string) {
    const db = getDb();
    const serviceTypeId = parseInt(formData.get('serviceType') as string);
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const notes = formData.get('notes') as string;

    await db.insert(appointments).values({
        userId,
        serviceTypeId,
        date,
        time,
        notes,
        status: 'PENDING',
        createdAt: new Date(),
    });

    revalidatePath('/dashboard');
    redirect('/dashboard');
}

export async function updateAppointmentStatus(id: number, status: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        console.error(`[AUTH] Unauthorized attempt to update appointment status. User: ${session?.user?.name || 'Unknown'}`);
        throw new Error('Unauthorized');
    }

    const db = getDb();
    await db.update(appointments)
        .set({ status: status as any })
        .where(eq(appointments.id, id));
    revalidatePath('/dashboard');
    console.log(`[ACTION] Appointment ${id} status updated to ${status} by Admin`);
}

export async function upsertAnnouncement(text: string) {
    const db = getDb();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

    console.log(`[SYNC] Deactivating all previous announcements before insert...`);
    // Be extremely aggressive: deactivate ALL active announcements
    await db.update(announcements)
        .set({ active: false, updatedAt: new Date() })
        .where(eq(announcements.active, true));

    console.log(`[SYNC] Inserting new announcement: "${text}"`);
    await db.insert(announcements).values({
        text,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // Revalidate everything from root up to ensure it clears caches everywhere
    revalidatePath('/', 'layout');
    revalidatePath('/dashboard', 'layout');
    revalidatePath('/dashboard/management');
}

export async function clearAllAnnouncements() {
    console.log(`[ACTION] Clearing all announcements`);
    const db = getDb();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

    await db.update(announcements)
        .set({ active: false, updatedAt: new Date() })
        .where(eq(announcements.active, true));

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard', 'layout');
    revalidatePath('/dashboard/management');
}

// Part Actions
export async function deletePart(partId: number) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

    const db = getDb();
    await db.delete(parts)
        .where(eq(parts.id, partId));

    revalidatePath('/inventory');
}

// Announcement Actions
export async function updateAnnouncement(id: number, text: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

    const db = getDb();
    await db.update(announcements)
        .set({ text, updatedAt: new Date() })
        .where(eq(announcements.id, id));
    revalidatePath('/');
}

// User Profile Actions
export async function updateUserProfile(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    const db = getDb();
    const phone = formData.get('phone') as string;
    const profileImage = formData.get('profileImage') as File | null;

    let profileImagePath: string | undefined = undefined;

    if (profileImage && profileImage.size > 0) {
        // Filesystem writing is not supported on Cloudflare Edge.
        // TODO: Implement Cloudflare R2 or similar.
        /*
        const buffer = Buffer.from(await profileImage.arrayBuffer());
        const filename = `${session.user.id}-${Date.now()}-${profileImage.name.replace(/\s+/g, '_')}`;
        const filePath = path.join(process.cwd(), 'public/images/profiles', filename);
        await writeFile(filePath, buffer);
        profileImagePath = `/images/profiles/${filename}`;
        */
    }

    await db.update(users)
        .set({
            phone,
            ...(profileImagePath ? { profileImage: profileImagePath } : {})
        })
        .where(eq(users.id, session.user.id));

    revalidatePath('/dashboard');
}

export async function addPart(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

    const db = getDb();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const categoryId = parseInt(formData.get('categoryId') as string);
    const image = formData.get('image') as File | null;

    let imagePath: string | undefined = undefined;

    if (image && image.size > 0) {
        try {
            // Filesystem writing is not supported on Cloudflare Edge.
            /*
            const buffer = Buffer.from(await image.arrayBuffer());
            const filename = `part-${Date.now()}-${image.name.replace(/\s+/g, '_')}`;
            const filePath = path.join(process.cwd(), 'public/images/parts', filename);
            await writeFile(filePath, buffer);
            imagePath = `/images/parts/${filename}`;
            */
        } catch (e) {
            console.error("Image upload failed:", e);
        }
    }

    await db.insert(parts).values({
        name,
        description,
        price,
        stock,
        categoryId,
        image: imagePath,
        addedBy: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    revalidatePath('/inventory');
}
// Success Story Actions
export async function createSuccessStory(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

    const db = getDb();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File | null;

    let imagePath: string | undefined = undefined;

    if (image && image.size > 0) {
        try {
            // Filesystem writing is not supported on Cloudflare Edge.
            /*
            const buffer = Buffer.from(await image.arrayBuffer());
            const filename = `story-${Date.now()}-${image.name.replace(/\s+/g, '_')}`;
            const filePath = path.join(process.cwd(), 'public/images/stories', filename);
            await writeFile(filePath, buffer);
            imagePath = `/images/stories/${filename}`;
            */
        } catch (e) {
            console.error("Story image upload failed:", e);
        }
    }

    await db.insert(successStories).values({
        title,
        description,
        image: imagePath,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    revalidatePath('/');
    revalidatePath('/dashboard/management');
}

export async function deleteSuccessStory(id: number) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

    const db = getDb();
    revalidatePath('/');
    revalidatePath('/dashboard/management');
}

// Employee Actions
export async function createEmployee(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

    const db = getDb();
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const bio = formData.get('bio') as string;
    const image = formData.get('image') as File | null;

    let imagePath: string | undefined = undefined;

    if (image && image.size > 0) {
        try {
            // Filesystem writing is not supported on Cloudflare Edge.
            /*
            const buffer = Buffer.from(await image.arrayBuffer());
            const filename = `employee-${Date.now()}-${image.name.replace(/\s+/g, '_')}`;
            const filePath = path.join(process.cwd(), 'public/images/team', filename);
            await writeFile(filePath, buffer);
            imagePath = `/images/team/${filename}`;
            */
        } catch (e) {
            console.error("Employee image upload failed:", e);
        }
    }

    await db.insert(employees).values({
        name,
        role,
        bio,
        image: imagePath,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    revalidatePath('/');
    revalidatePath('/dashboard/management');
}

export async function deleteEmployee(id: number) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');

    const db = getDb();
    await db.delete(employees).where(eq(employees.id, id));

    revalidatePath('/');
    revalidatePath('/dashboard/management');
}
