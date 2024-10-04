import React from 'react';
import { Card, CardContent, Container, Typography } from '@mui/material';
import Box from "@mui/material/Box";

const WeatherCard = ({ weather }) => {
    const { current, location } = weather;
    return (
    //     box with background primary
        <Box sx={ {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: '10px',
            padding: '20px',
        } }>
            <Container sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Box className={'weather-info'} xs={{
                    textAlign: 'left',
                    padding: '10px'
                }}>
                    <Typography component={'div'} variant={'h4'} mb={2}>
                        <Box sx={{ fontWeight: 'bold'}}>
                            {location.name} ( {new Date(location.localtime).toLocaleDateString()} )
                        </Box>
                    </Typography>
                    <Box>
                        <Typography variant={'h6'}>
                            Temperature: {current.temp_c}°C
                        </Typography>
                        <Typography variant={'h6'} mt={2}>
                            Wind: {current.wind_mph} M/s
                        </Typography>
                        <Typography variant={'h6'} mt={2}>
                            Humidity: {current.humidity}%
                        </Typography>
                    </Box>
                </Box>
                <Box
                    className={'weather-display'}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <img src={current.condition.icon} alt={current.condition.text}/>
                    <Typography variant={'h6'}>{current.condition.text}</Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default WeatherCard;
