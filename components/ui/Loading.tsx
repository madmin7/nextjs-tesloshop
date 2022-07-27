import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'





export const Loading = () => {
  return (
    <Box 
        display='flex' 
        flexDirection={'column'}
        justifyContent='center' 
        alignItems='center' 
        height='calc(100vh - 200px)'
    >
        <Typography 
            variant='h2' 
            component={'h2'} 
            sx={{ mb: 3 }}
            fontWeight={ 200 }
        >Cargando..  </Typography>
        <CircularProgress thickness={ 3 }/>
    </Box>
  )
}
