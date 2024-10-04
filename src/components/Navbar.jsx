import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { QuestionMarkRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
    Alert,
    Avatar,
    CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, List, ListItem, ListItemText,
    Menu,
    MenuItem, Snackbar,
    Switch, TextField,
    Tooltip,
    Drawer
} from "@mui/material";
import axios from 'axios';

const Navbar = ({ drawerOpen, toggleDrawer, cachedLocations, updateWeather }) => {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);  // State for opening and closing the dropdown
    const [isSubscribed, setIsSubscribed] = useState(false); // Subscription state
    const [loading, setLoading] = useState(false); // Loading state for overlay
    const [openModal, setOpenModal] = useState(false); // State for modal
    const [location, setLocation] = useState(''); // Location input state
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar severity (success or error)

    useEffect(() => {
        // Check if the user information exists in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUser(user);
            setIsSubscribed(user.is_subscribed);
        }
    }, []);

    // Handle opening the avatar dropdown
    const handleAvatarClick = ( event ) => {
        setAnchorEl(event.currentTarget);
    };

    // Handle closing the dropdown
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle subscription toggle
    // Handle subscription toggle
    const handleSubscriptionToggle = async (event) => {
        const subscribe = event.target.checked;
        setIsSubscribed(subscribe);

        if (subscribe) {
            // Open the modal to input location if subscribing
            setOpenModal(true);
        } else {
            // You can handle the unsubscription logic here
        //     fetch to backend to update user subscription
            try {
                const response = await axios.post(
                    `${process.env.BE_ENDPOINT}/unsubscribe`,
                    {
                        email: user.email,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Allow-Control-Allow-Origin': '*',
                        }
                    });

                if (response.data?.status) {
                    // error when exist status in response
                    console.error('Failed to update subscription:', response.data);
                    setSnackbarMessage(response.data.message);
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    return;
                } else {
                    // Update user object
                    user.is_subscribed = false;
                    localStorage.setItem('user', JSON.stringify(user));
                    // show success message
                    setSnackbarMessage('Unsubscribed');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
                }
            } catch (error) {
                console.error('Failed to update subscription:', error);
            }
        }
    };

    // Close the Snackbar after the message is displayed
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Handle modal submission
    const handleSubmitLocation = async () => {
        setOpenModal(false); // Close modal
        setLoading(true); // Show loading spinner

        try {
            // Call API to update subscription (replace with your actual API endpoint)
            // const response = await axios.post('/api/subscribe', {
            //     subscribe: true,
            //     location,
            // });
            console.log('User subscribed to', location);
            const response = await axios.post(`${process.env.BE_ENDPOINT}/subscribe`, {
                email: user.email,
                'subscribe_location': location,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Allow-Control-Allow-Origin': '*',
                }
            });

            if (response.data?.status) {
                // error when exist status in response
                console.error('Failed to update subscription:', response.data);
                setSnackbarMessage(response.data.message);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            setIsSubscribed(true); // Update subscription state
            user.is_subscribed = true; // Update user object
            localStorage.setItem('user', JSON.stringify(user)); // Update localStorage
            // show success message
            setSnackbarMessage('Subscription updated');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // // Optionally handle response, e.g., show success message or update state
            // console.log('Subscription updated:', response.data);
        } catch (error) {
            console.error('Failed to update subscription:', error);
        } finally {
            setLoading(false); // Hide loading spinner after the request is done
        }
    };

    function handleLogin() {
        const popup = window.open(
            `${ process.env.BE_ENDPOINT }/auth/google`,
            '_blank',
            'width=600,height=600'
        );

        const receiveMessage = ( event ) => {
            if (event.origin !== process.env.BE_ENDPOINT) return; // Ensure the message is from the correct origin
            const { user } = event.data; // Assuming the server sends user data
            if (user) {
                // Store the user info (e.g., in localStorage or state)
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
            }
            // popup.close(); // Close the popup window
            window.removeEventListener('message', receiveMessage); // Cleanup event listener
        };

        // Listen for messages from the popup window
        window.addEventListener('message', receiveMessage, false);
    }

    const handleCacheLocation = async (locationData) => {
        console.log('fetching weather for', locationData);
        const response = await axios.get(
            `${ process.env.BE_ENDPOINT }/api/weather?q=${locationData}`
        ).catch(
            error => {
                console.error('Error fetching weather data:', error);
            }
        );

        if (!response.data) {
            console.error('No data received from API');
            return;
        }

        const { current, forecast, location } = response.data.forecast;
        console.log('location', location);
        return;
        updateWeather({
            current: {
                current: current,
                location: location,
            },
            forecast,
        });
        toggleDrawer(false);
    }
    return (
        <Box sx={ { flexGrow: 1 } }>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={ { mr: 2 } }
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={ { flexGrow: 1 } }>
                        Weather App
                    </Typography>
                    {/*show tooltip*/ }
                    <Tooltip title="Let login with us to get weather daily" mx={ 2 }>
                        <IconButton color="inherit">
                            <QuestionMarkRounded/>
                        </IconButton>
                    </Tooltip>
                    { user ? (
                        <Box>
                            <IconButton onClick={ handleAvatarClick }>
                                <Avatar src={ user.avatar } alt={ user.name }/>
                            </IconButton>
                            <Menu
                                anchorEl={ anchorEl }
                                open={ Boolean(anchorEl) }
                                onClose={ handleClose }
                            >
                                <MenuItem>
                                    <Typography>Logged in as: { user.name }</Typography>
                                </MenuItem>
                                <MenuItem>
                                    <Typography>Subscribe to daily weather updates</Typography>
                                    <Switch
                                        checked={ isSubscribed }
                                        onChange={ handleSubscriptionToggle }
                                        inputProps={ { 'aria-label': 'controlled' } }
                                    />
                                </MenuItem>
                            {/*    Logout*/}
                                <MenuItem onClick={ () => {
                                    localStorage.removeItem('user');
                                    setUser(null);
                                    handleClose();
                                } }>Logout</MenuItem>
                            </Menu>
                        </Box>
                    ) : (<Button color="inherit" onClick={ handleLogin }>Login</Button>) }
                </Toolbar>
                {/* Modal for entering location */}
                <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                    <DialogTitle>Enter your location</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Location"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                        <Button onClick={handleSubmitLocation}>Submit</Button>
                    </DialogActions>
                </Dialog>

                {/* Overlay loading spinner */}
                {loading && (
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999,
                        }}
                    >
                        <CircularProgress size={60} />
                    </Box>
                )}

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </AppBar>

            {/* Drawer component */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <List>
                    <ListItem>
                        <ListItemText primary="Cached Locations" />
                    </ListItem>
                    {cachedLocations.map((location, index) => (
                        <ListItem button key={index} onClick={() => updateWeather(location)}>
                            <ListItemText primary={location} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}

export default Navbar;
