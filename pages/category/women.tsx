import { Typography } from '@mui/material';
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products/ProductList';
import { Loading } from '../../components/ui';
import { useProducts } from '../../hooks';



const WomenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=women');

  return (
    <ShopLayout title={ 'Teslo-Shop - Women' } pageDescription={ 'Encuentra los mejores productos para niños' }>
      <Typography variant='h1' component='h1' >Mujeres</Typography>
      <Typography variant='h2' sx={{ mb: 1 }} >Productos para mujeres</Typography>
      

      {
        isLoading
        ? <Loading />
        : <ProductList products={ products } />
      }

    </ShopLayout>
  )
}

export default WomenPage;
