'use client';

import {
    Admin,
    Resource,
    List,
    Datagrid,
    TextField,
    NumberField,
    DateField,
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    ReferenceField,
    ReferenceInput,
    SelectInput,
    Create,
    BooleanInput,
    BooleanField,
    Layout,
    AppBar,
    UserMenu,
    Logout,
    Show,
    SimpleShowLayout,
    RichTextField,
    EditGuesser,
    ListGuesser,
} from 'react-admin';
import { createTheme, Box, Typography } from '@mui/material';
import simpleRestProvider from 'ra-data-simple-rest';

const bhutanTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#0072bc', // hyundai-accent
        },
        secondary: {
            main: '#002c5f', // hyundai-blue
        },
        background: {
            default: '#050b16', // bg-dark
            paper: '#0a1425',
        },
        text: {
            primary: '#f8f9fa',
        }
    },
    typography: {
        fontFamily: ['Outfit', 'sans-serif'].join(','),
        h6: {
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
        }
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#002c5f',
                    borderBottom: '1px solid #0072bc',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                }
            }
        }
    }
});

const CustomAppBar = (props: any) => (
    <AppBar {...props} userMenu={<UserMenu><Logout /></UserMenu>}>
        <Box flex="1" display="flex" alignItems="center">
            <Typography variant="h6" color="inherit" id="react-admin-title" sx={{ fontWeight: 800, pr: 2 }}>
                BHUTAN <span style={{ color: '#0072bc' }}>HYUNDAI</span> MOTORS
            </Typography>
        </Box>
    </AppBar>
);

const CustomLayout = (props: any) => <Layout {...props} appBar={CustomAppBar} />;

const dataProvider = simpleRestProvider('/api/admin');

import { signIn, signOut, getSession } from 'next-auth/react';

const authProvider = {
    login: async ({ username, password }: any) => {
        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        });

        if (result?.error) {
            throw new Error(result.error);
        }

        const session = await getSession();
        if (session?.user.role !== 'ADMIN') {
            await signOut({ redirect: false });
            throw new Error('Access denied. Administrator privileges required.');
        }

        return Promise.resolve();
    },
    logout: async () => {
        await signOut({ redirect: false });
        return Promise.resolve();
    },
    checkAuth: async () => {
        const session = await getSession();
        return session && session.user.role === 'ADMIN' ? Promise.resolve() : Promise.reject();
    },
    checkError: (error: any) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: async () => {
        const session = await getSession();
        return session?.user.role ? Promise.resolve(session.user.role) : Promise.reject();
    },
    getIdentity: async () => {
        const session = await getSession();
        if (session?.user) {
            return Promise.resolve({
                id: session.user.id,
                fullName: session.user.name || session.user.email || 'Admin'
            });
        }
        return Promise.reject();
    },
};

// --- User Components ---
const UserList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="username" />
            <TextField source="email" />
            <TextField source="role" />
            <DateField source="createdAt" />
        </Datagrid>
    </List>
);

const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="username" />
            <TextField source="email" />
            <TextField source="role" />
            <DateField source="createdAt" />
        </SimpleShowLayout>
    </Show>
);

const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="username" fullWidth />
            <TextInput source="email" fullWidth />
            <SelectInput source="role" choices={[
                { id: 'ADMIN', name: 'Admin' },
                { id: 'CUSTOMER', name: 'Customer' },
            ]} />
        </SimpleForm>
    </Edit>
);

const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="username" fullWidth />
            <TextInput source="email" fullWidth />
            <TextInput source="password" type="password" fullWidth />
            <SelectInput source="role" choices={[
                { id: 'ADMIN', name: 'Admin' },
                { id: 'CUSTOMER', name: 'Customer' },
            ]} defaultValue="CUSTOMER" />
        </SimpleForm>
    </Create>
);

// --- Part Components ---
const PartList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="name" />
            <NumberField source="price" locales="en-IN" />
            <NumberField source="stock" />
            <ReferenceField source="categoryId" reference="categories" link="show" />
        </Datagrid>
    </List>
);

const PartShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <RichTextField source="description" />
            <NumberField source="price" />
            <NumberField source="stock" />
            <ReferenceField source="categoryId" reference="categories" />
            <TextField source="image" />
            <DateField source="createdAt" />
        </SimpleShowLayout>
    </Show>
);

const PartEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" fullWidth />
            <TextInput source="description" multiline fullWidth />
            <NumberInput source="price" />
            <NumberInput source="stock" />
            <ReferenceInput source="categoryId" reference="categories" />
            <TextInput source="image" fullWidth />
        </SimpleForm>
    </Edit>
);

const PartCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" fullWidth />
            <TextInput source="description" multiline fullWidth />
            <NumberInput source="price" />
            <NumberInput source="stock" />
            <ReferenceInput source="categoryId" reference="categories" />
            <TextInput source="image" fullWidth />
        </SimpleForm>
    </Create>
);

// --- Appointment Components ---
const AppointmentList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <ReferenceField source="userId" reference="users" label="Client" />
            <ReferenceField source="serviceTypeId" reference="serviceTypes" label="Service" />
            <TextField source="date" />
            <TextField source="time" />
            <TextField source="status" />
        </Datagrid>
    </List>
);

const AppointmentShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="userId" reference="users" />
            <ReferenceField source="serviceTypeId" reference="serviceTypes" />
            <TextField source="date" />
            <TextField source="time" />
            <TextField source="status" />
            <RichTextField source="notes" />
            <DateField source="createdAt" />
        </SimpleShowLayout>
    </Show>
);

const AppointmentEdit = () => (
    <Edit>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users" />
            <ReferenceInput source="serviceTypeId" reference="serviceTypes" />
            <TextInput source="date" />
            <TextInput source="time" />
            <SelectInput source="status" choices={[
                { id: 'PENDING', name: 'Pending' },
                { id: 'CONFIRMED', name: 'Confirmed' },
                { id: 'IN_PROGRESS', name: 'In Progress' },
                { id: 'COMPLETED', name: 'Completed' },
                { id: 'CANCELLED', name: 'Cancelled' },
            ]} />
            <TextInput source="notes" multiline fullWidth />
        </SimpleForm>
    </Edit>
);

const AppointmentCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users" />
            <ReferenceInput source="serviceTypeId" reference="serviceTypes" />
            <TextInput source="date" />
            <TextInput source="time" />
            <SelectInput source="status" choices={[
                { id: 'PENDING', name: 'Pending' },
            ]} defaultValue="PENDING" />
            <TextInput source="notes" multiline fullWidth />
        </SimpleForm>
    </Create>
);

// --- Category Components ---
const CategoryList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="name" />
        </Datagrid>
    </List>
);

const CategoryShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
        </SimpleShowLayout>
    </Show>
);

const CategoryEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" fullWidth />
        </SimpleForm>
    </Edit>
);

const CategoryCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" fullWidth />
        </SimpleForm>
    </Create>
);

// --- Service Type Components ---
const ServiceTypeList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="name" />
            <NumberField source="price" />
        </Datagrid>
    </List>
);

const ServiceTypeShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="description" />
            <NumberField source="price" />
        </SimpleShowLayout>
    </Show>
);

const ServiceTypeEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" fullWidth />
            <TextInput source="description" multiline fullWidth />
            <NumberInput source="price" />
        </SimpleForm>
    </Edit>
);

const ServiceTypeCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" fullWidth />
            <TextInput source="description" multiline fullWidth />
            <NumberInput source="price" />
        </SimpleForm>
    </Create>
);

// --- Announcement Components ---
const AnnouncementList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="text" />
            <BooleanField source="active" />
            <DateField source="createdAt" />
        </Datagrid>
    </List>
);

const AnnouncementShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="text" />
            <BooleanField source="active" />
            <DateField source="createdAt" />
        </SimpleShowLayout>
    </Show>
);

const AnnouncementEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="text" fullWidth multiline />
            <BooleanInput source="active" />
        </SimpleForm>
    </Edit>
);

const AnnouncementCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="text" fullWidth multiline />
            <BooleanInput source="active" defaultValue={true} />
        </SimpleForm>
    </Create>
);

import AdminDashboard from './AdminDashboard';

import {
    People as PeopleIcon,
    Build as BuildIcon,
    Category as CategoryIcon,
    Event as EventIcon,
    Campaign as CampaignIcon
} from '@mui/icons-material';

const AdminApp = () => (
    <Admin
        dashboard={AdminDashboard}
        dataProvider={dataProvider}
        authProvider={authProvider}
        theme={bhutanTheme}
        layout={CustomLayout}
    >
        <Resource
            name="users"
            list={UserList}
            show={UserShow}
            edit={UserEdit}
            create={UserCreate}
            recordRepresentation="username"
            icon={PeopleIcon}
        />
        <Resource
            name="parts"
            list={PartList}
            show={PartShow}
            edit={PartEdit}
            create={PartCreate}
            recordRepresentation="name"
            icon={BuildIcon}
        />
        <Resource
            name="appointments"
            list={AppointmentList}
            show={AppointmentShow}
            edit={AppointmentEdit}
            create={AppointmentCreate}
            icon={EventIcon}
        />
        <Resource
            name="categories"
            list={CategoryList}
            show={CategoryShow}
            edit={CategoryEdit}
            create={CategoryCreate}
            recordRepresentation="name"
            icon={CategoryIcon}
        />
        <Resource
            name="serviceTypes"
            list={ServiceTypeList}
            show={ServiceTypeShow}
            edit={ServiceTypeEdit}
            create={ServiceTypeCreate}
            recordRepresentation="name"
            icon={BuildIcon}
        />
        <Resource
            name="announcements"
            list={AnnouncementList}
            show={AnnouncementShow}
            edit={AnnouncementEdit}
            create={AnnouncementCreate}
            icon={CampaignIcon}
        />
    </Admin>
);

export default AdminApp;
