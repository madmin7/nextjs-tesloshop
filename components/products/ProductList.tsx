import { Grid } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import { IProduct } from '../../interfaces';
import { ProductCard } from './ProductCard';

interface Props {
    products: IProduct[],
}


export const ProductList: FC <PropsWithChildren<Props>> = ({ products }) => {

  return (
    
    <Grid container spacing={ 4 } >
        {
            products.map( producto => (
                <ProductCard 
                  producto={ producto } 
                  key={ producto.slug }
                />
            ))
        }
    </Grid>
  )
}
