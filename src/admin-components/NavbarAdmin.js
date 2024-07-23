import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const NavbarAdmin = () => {
    return (
        <div>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {/* Sidebar Header */}
                <AppBar position="static" sx={{ backgroundColor: 'grey', boxShadow: 'none', padding: '16px' }}>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>FIT</span>
                        <span style={{ color: 'rgb(0, 136, 199)', fontWeight: 'bold' }}>ZONE</span>
                    </Typography>
                </AppBar>

                {/* Navigation Items */}
                <List>
                    <ListItem>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/users">
                        <ListItemText primary="Users" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/coaches">
                        <ListItemText primary="Coach" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/revenues">
                        <ListItemText primary="Revenue" />
                    </ListItem>
                    <List component="div" disablePadding>
                        <ListItem button component={Link} to="/admin/revenues" sx={{ pl: 4 }}>
                            <ListItemText primary="Course Revenue" />
                        </ListItem>
                        <ListItem button component={Link} to="/admin/transactions" sx={{ pl: 4 }}>
                            <ListItemText primary="Product Transaction" />
                        </ListItem>
                    </List>

                    <ListItem button component={Link} to="/admin/classes">
                        <ListItemText primary="Class" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/products">
                        <ListItemText primary="Product" />
                    </ListItem>
                    {/* Add more navigation items here */}
                </List>

                {/* Logout Button */}
                <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                    <List>
                        <ListItem button component={Link} to="/admin">
                            <ListItemText primary="Logout" />
                            <IconButton color="inherit">
                                <LogoutIcon />
                            </IconButton>
                        </ListItem>
                    </List>
                </div>
            </Drawer>

            {/* Main Content Area */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginLeft: drawerWidth }}>
                {/* Top Navbar */}
                <AppBar
                    position="fixed"
                    sx={{
                        backgroundColor: 'grey', // Set the background color to grey
                        zIndex: 1201,
                        width: `calc(100% - ${drawerWidth}px)`,
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                            {/* Your title or other content */}
                        </Typography>
                        <IconButton color="inherit" component={Link} to="/admin/profile" startIcon={<AccountCircleIcon />}>
                            <Typography variant="body1" sx={{ ml: 1 }} style={{ color: '#fff', fontWeight: 'bold' }}>Admin</Typography>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Main Content */}
                <main style={{ flexGrow: 1, padding: 16, marginTop: 64 }}>
                    {/* Main content will be rendered here */}
                </main>
            </div>
        </div>
    );
};

export default NavbarAdmin;
