import React from 'react';
import { Grid2, Typography } from '@mui/material';
import ForecastCard from './ForecastCard';
import Box from "@mui/material/Box";

const Forecast = ( { forecast } ) => {
    console.log('forecast', forecast);
    return (
        <>
            <Typography component={ 'div' } variant={ 'h4' } my={ 2 }>
                <Box sx={ { fontWeight: 'bold' } }>{ forecast.length }-day Forecast</Box>
            </Typography>
            <Box xs={ {
                display: 'flex',
                justifyContent: 'center',
                padding: 4
            } }>
                <Grid2 container spacing={ 2 } xs={ {
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 2
                } }>
                    { forecast.map(( day, index ) => (
                        <Grid2
                            item
                            key={ index }
                            xs={ {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 2
                            } }
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4,
                                lg: 3
                            }}
                        >
                            <ForecastCard day={ day }/>
                        </Grid2>
                    )) }
                </Grid2>
            </Box>
        </>
    );
};

export default Forecast;
