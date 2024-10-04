import React from 'react';
import { Card, CardContent, Container, Typography } from '@mui/material';
import Box from "@mui/material/Box";

const ForecastCard = ({ day }) => {
    return (
        <Box sx={ {
            backgroundColor: 'secondary.main',
            color: 'primary.contrastText',
            borderRadius: '10px',
            padding: '20px',
        } }>
            <Typography variant="h6" align={'center'}>({new Date(day.date).toLocaleDateString()})</Typography>
            {/*icon*/}
            <Container sx={ {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            } }>
                <img src={day.day.condition.icon} alt={day.day.condition.text}/>
            </Container>
            <Typography variant="body1">Temp: {day.day.avgtemp_c}°C</Typography>
            <Typography variant="body1">Wind: {day.day.avgvis_miles} m/s</Typography>
            <Typography variant="body1">Humidity: {day.day.avghumidity}%</Typography>
        </Box>
    );
};

export default ForecastCard;
