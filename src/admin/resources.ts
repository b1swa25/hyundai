import { users, categories, parts, serviceTypes, appointments, announcements } from '../db/schema';

export const adminResources = [
    {
        resource: users,
        options: {
            navigation: { name: 'User Management', icon: 'User' },
            properties: {
                password: { isVisible: { list: false, edit: true, filter: false, show: false } },
            },
        },
    },
    {
        resource: categories,
        options: {
            navigation: { name: 'Inventory', icon: 'Folder' },
        },
    },
    {
        resource: parts,
        options: {
            navigation: { name: 'Inventory', icon: 'Settings' },
        },
    },
    {
        resource: serviceTypes,
        options: {
            navigation: { name: 'Services', icon: 'Tool' },
        },
    },
    {
        resource: appointments,
        options: {
            navigation: { name: 'Services', icon: 'Calendar' },
        },
    },
    {
        resource: announcements,
        options: {
            navigation: { name: 'Content', icon: 'MessageSquare' },
        },
    },
];
