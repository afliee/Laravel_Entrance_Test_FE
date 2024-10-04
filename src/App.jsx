import React, { useState, useEffect } from 'react';
import { Box, Container, createTheme, Grid2, Paper, styled, ThemeProvider, Typography } from '@mui/material';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import axios from 'axios';
import './App.css';
import Navbar from "./components/Navbar.jsx";

const theme = createTheme({
    palette: {
        background: {
            default: "#e4f0e2"
        },
        primary: {
            main: "#5372f0",
        },
        secondary: {
            main: "#6c757d",
        }
    }
});

const Item = styled(Paper)(( { theme } ) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));


const App = () => {
    const [weather, setWeather] = useState(null);
    const [cachedLocations, setCachedLocations] = useState([]); // State for cached locations

    const [drawerOpen, setDrawerOpen] = useState(false); // State to control Drawer visibility

    console.log('weather', weather);
    // const defaultCity = weather ? weather.current.location.name : 'London';
    const defaultCity = 'London';
    // Toggle drawer visibility
    const toggleDrawer = ( open ) => ( event ) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };


    // Fetch weather data for London by default when the app is accessed
    useEffect(() => {
        const fetchCachedLocations = async () => {
            try {
                const response = await axios.get(
                    `${ process.env.BE_ENDPOINT }/api/weather/cached`
                );
                // check if response with status 404
                if (response.status === 404) {
                    return;
                }

                // data is json with property locations
                console.log('locations', response.data);

                setCachedLocations(response.data.locations);
            } catch (error) {
                console.error('Error fetching cached locations:', error);
            }
        }

        fetchWeather(defaultCity)
        fetchCachedLocations()
    }, []); // Empty dependency array ensures this runs only once on mount

// Function to fetch weather data for a specific location
    const fetchWeather = async (locationData) => {
        try {
            const response = await axios.get(
                `${ process.env.BE_ENDPOINT }/api/weather?q=${locationData || defaultCity }`
            );

            if (!response.data) {
                console.error('No data received from API');
                return;
            }

            const { current, forecast, location } = response.data.forecast;
            setWeather({
                current: {
                    current: current,
                    location: location,
                },
                forecast,
            });
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    return (
        <ThemeProvider theme={ theme }>
            <Navbar drawerOpen={ drawerOpen } toggleDrawer={ toggleDrawer } cachedLocations={ cachedLocations }
                    updateWeather={ fetchWeather }/>

            <Box sx={ { flexGrow: 1 } }>
                <Grid2 container spacing={ 2 } sx={ {
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 4
                } }>
                    <Grid2 item size={ {
                        xs: 12,
                        sm: 12,
                        md: 4,
                        lg: 4
                    } }>
                        <SearchBar updateWeather={ setWeather }/>
                    </Grid2>
                    <Grid2 item size={ {
                        xs: 12,
                        sm: 12,
                        md: 8,
                        lg: 8
                    } }>
                        { weather ? (
                            <>
                                <WeatherCard weather={ weather.current }/>
                                <Forecast forecast={ weather.forecast.forecastday }/>
                            </>
                        ) : (
                            <Typography variant="h6" gutterBottom>
                                Loading...
                            </Typography>
                        ) }
                    </Grid2>
                </Grid2>
            </Box>

        </ThemeProvider>
    );
};

export default App;
