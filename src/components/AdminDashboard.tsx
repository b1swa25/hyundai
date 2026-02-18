import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import {
    People as PeopleIcon,
    Build as BuildIcon,
    Category as CategoryIcon,
    Event as EventIcon,
    Campaign as CampaignIcon
} from '@mui/icons-material';
import { Title } from 'react-admin';

const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-5px)',
            background: 'rgba(255, 255, 255, 0.08)',
        }
    }}>
        <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${color}20`,
                        color: color
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="h6" component="div" sx={{ ml: 2, fontWeight: 600, color: 'text.secondary', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 800 }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

import { useNavigate } from 'react-router-dom';
import { Button } from 'react-admin';
import { Add as AddIcon, Edit as EditIcon, Launch as LaunchIcon } from '@mui/icons-material';

const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch stats', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box mt={3}>
            <Title title="Dashboard" />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
                System <span style={{ color: '#0072bc' }}>Overview</span>
            </Typography>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <StatCard
                        title="Users"
                        value={stats?.users || 0}
                        icon={<PeopleIcon />}
                        color="#0072bc"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <StatCard
                        title="Parts"
                        value={stats?.parts || 0}
                        icon={<BuildIcon />}
                        color="#4caf50"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <StatCard
                        title="Categories"
                        value={stats?.categories || 0}
                        icon={<CategoryIcon />}
                        color="#ff9800"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <StatCard
                        title="Appointments"
                        value={stats?.appointments || 0}
                        icon={<EventIcon />}
                        color="#f44336"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <StatCard
                        title="Announcements"
                        value={stats?.activeAnnouncements || 0}
                        icon={<CampaignIcon />}
                        color="#9c27b0"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={4} mt={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{
                        p: 4,
                        height: '100%',
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, rgba(0, 114, 188, 0.1) 0%, rgba(0, 44, 95, 0.1) 100%)',
                        border: '1px solid rgba(0, 114, 188, 0.2)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Latest Announcement
                            </Typography>
                            <Box>
                                <Button
                                    onClick={() => navigate('announcements/create')}
                                    label="Create"
                                    startIcon={<AddIcon />}
                                    sx={{ mr: 1 }}
                                />
                                {stats?.latestAnnouncement && (
                                    <Button
                                        onClick={() => navigate(`announcements/${stats.latestAnnouncement.id}`)}
                                        label="Edit"
                                        startIcon={<EditIcon />}
                                    />
                                )}
                            </Box>
                        </Box>

                        {stats?.latestAnnouncement ? (
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2, color: 'text.primary' }}>
                                    "{stats.latestAnnouncement.text}"
                                </Typography>
                                {stats.latestAnnouncement.updatedAt && (
                                    <Typography variant="caption" color="text.secondary">
                                        Last updated: {new Date(stats.latestAnnouncement.updatedAt).toLocaleString() !== 'Invalid Date'
                                            ? new Date(stats.latestAnnouncement.updatedAt).toLocaleString()
                                            : 'Recently'}
                                    </Typography>
                                )}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                No active announcements found.
                            </Typography>
                        )}

                        <Box mt={3}>
                            <Button
                                onClick={() => navigate('announcements')}
                                label="View All Announcements"
                                endIcon={<LaunchIcon />}
                            />
                        </Box>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{
                        p: 4,
                        height: '100%',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                            Welcome to the Admin Portal
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mb={3}>
                            Manage your inventory, users, and service appointments efficiently. Use the sidebar to navigate through different resources.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Quickly update the storefront announcement to keep customers informed about your latest services and offers.
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;
