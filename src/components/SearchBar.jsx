import React, { useState } from 'react';
import { Box, Button, Container, Divider, TextField } from '@mui/material';
import axios from 'axios';
import Typography from "@mui/material/Typography";

const SearchBar = ( { updateWeather } ) => {
    const [city, setCity] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get(
                `${process.env.BE_ENDPOINT}/api/weather?q=${ city }`
            );
            if (!response.data) {
                console.error('No data received from API');
                return;
            }
            const { current, forecast, location } = response.data.forecast;
            updateWeather({
                current: {
                    current: current,
                    location: location,
                },
                forecast,
            });
        } catch (error) {
            console.error("Error fetching weather data", error);
        }
    };
    const handleUseCurrentLocation = async () => {
        // get current position from browser
        navigator.geolocation.getCurrentPosition(async ( position ) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await axios.get(
                    `${process.env.BE_ENDPOINT}/api/weather?q=${ latitude },${ longitude }`
                );
                // Assuming response is formatted with 'current' and 'forecast' keys
                if (!response.data) {
                    console.error('No data received from API');
                    return;
                }
                const { current, forecast, location } = response.data.forecast;
                setCity(location.name);
                updateWeather({
                    current: {
                        current: current,
                        location: location,
                    },
                    forecast,
                });

            } catch (error) {
                console.error("Error fetching weather data", error);
            }
        });
    }
    return (
        <Box sx={ {
            flexGrow: 1,
            display: 'flex',
            alignItems: 'left',
            flexDirection: 'column',
        } } px={ 2 }>
            {/*text bold and h6*/ }
            <Typography variant="h6" gutterBottom>
                Enter a City Name
            </Typography>
            <TextField
                label="Enter a City Name"
                variant="outlined"
                value={ city }
                onChange={ ( e ) => setCity(e.target.value) }
                style={ { marginBottom: '10px' } }
            />
            <Button variant="contained" onClick={ handleSearch } size={ 'large' }>
                Search
            </Button>

            <Divider sx={ { marginY: '10px' } }>or</Divider>
            <Button
                variant="contained"
                onClick={ () => handleUseCurrentLocation() }
                size={ 'large' }
                color="secondary"
                className={ 'button' }
            >
                Use Current Location
            </Button>
        </Box>
    );
};

export default SearchBar;
