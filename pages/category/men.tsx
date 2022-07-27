import { Typography } from '@mui/material';
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products/ProductList';
import { Loading } from '../../components/ui';
import { useProducts } from '../../hooks';



const MenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout title={ 'Teslo-Shop - Men' } pageDescription={ 'Encuentra los mejores productos para niños' }>
      <Typography variant='h1' component='h1' >Hombres</Typography>
      <Typography variant='h2' sx={{ mb: 1 }} >Productos para hombres</Typography>
      

      {
        isLoading
        ? <Loading />
        : <ProductList products={ products } />
      }

    </ShopLayout>
  )
}

export default MenPage;
