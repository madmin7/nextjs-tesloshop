import { Box, Card, CardActionArea, CardMedia, Grid, Typography, Link, Chip } from '@mui/material';
import { FC, PropsWithChildren, useMemo, useState } from 'react';
import { IProduct } from '../../interfaces';

import NextLink from 'next/link'


interface Props {
    producto: IProduct,
}


export const ProductCard: FC <PropsWithChildren<Props>> = ({ producto }) => {

  const [isHovered, setIsHovered] = useState ( false );

  const [isImageLoaded, setIsImageLoaded] = useState ( false );

  const productImage = useMemo( () => {
      return isHovered
        ? producto.images[1]
        : producto.images[0];

  }, [isHovered, producto.images])


  return (
    <Grid 
      item 
      xs={ 6 } 
      sm={ 4 }
      onMouseEnter={ () => setIsHovered( true ) }
      onMouseLeave={ () => setIsHovered( false ) }
    >
        <Card>
            <NextLink href={`/product/${ producto.slug }`} passHref prefetch={ false }>
              <Link>
                <CardActionArea>
                    {
                      (producto.inStock === 0 ) && (
                        <Chip 
                          color='primary'
                          label= 'No hay disponibles'
                          sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }} 
                        />
                      )
                    }

                    <CardMedia
                      className='fadeIn'
                      component='img'
                      image={ productImage }
                      alt={ producto.title }
                      onLoad={ ()=> setIsImageLoaded( true ) }
                    />

                </CardActionArea>
              </Link>
            </NextLink>
        </Card>

        <Box sx={{ mt: 1, diplay: isImageLoaded ? 'block' : 'none' }} className='fadeIn' >
          <Typography fontWeight={700}>{ producto.title }</Typography>
          <Typography fontWeight={500}>${ producto.price }</Typography>
        </Box>
    </Grid>
  )
}
