import NextLink from 'next/link'
import { Typography, Grid, Link, CardActionArea, CardMedia, Box, Button } from '@mui/material'; 
import { ItemCounter } from '../ui';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { ICartProduct, IOrderItem } from '../../interfaces';




interface Props {
    editable?: boolean;
    products?: IOrderItem[]
}


export const CartList: FC <Props> = ({ editable= false, products }) => {

    const { cart, updateCartQuantity, removeCartProduct } = useContext( CartContext );


    const onNewCartQuantityValue = ( product: ICartProduct, newQuantity: number )=> {
        product.quantity = newQuantity;
        updateCartQuantity( product );
    }

    const productsToShow = products ? products : cart;

    return (
        <>
            {
                productsToShow.map( producto => (
                    <Grid container spacing={ 2 } key={ producto.slug + producto.size } sx={{ mb: 1 }}>

                        <Grid item xs={ 3 }>
                            { /* llevar a la pagina del producto */ }
                            <NextLink href={`/product/${ producto.slug }`} passHref>
                                <Link>
                                    <CardActionArea>
                                        <CardMedia 
                                            image={  producto.image }
                                            component='img'
                                            sx={{ borderRadius: '5px' }}
                                        />
                                    </CardActionArea>
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid item xs={ 7 }>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant='body1'>{ producto.title }</Typography>
                                <Typography variant='body1'>Talla: <strong>{ producto.size }</strong></Typography>

                                {/* Condicional */}
                                {
                                    editable 

                                    ? (<ItemCounter 
                                        currentValue={ producto.quantity }
                                        updateQuantity={ ( newQuantity ) => onNewCartQuantityValue( producto as ICartProduct, newQuantity )}
                                        maxValue={ 10 }
                                    />)
                                    : <Typography variant='h5'>{ producto.quantity } { producto.quantity > 1 ? 'productos' : 'producto'}</Typography>
                                }
                                
                            </Box>
                        </Grid>

                        <Grid item xs={ 2 } display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1'>${ producto.price }</Typography>
                            {/* Editable */}
                            {
                                editable && (
                                <Button 
                                    variant='text' 
                                    color='secondary'
                                    onClick={ ()=> removeCartProduct( producto as ICartProduct ) }
                                >
                                    Remover
                                </Button>
                                )
                            }
                        </Grid>
                    </Grid>
                ))
            }
        </>
    )
}
