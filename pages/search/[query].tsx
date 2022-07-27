import { Typography, Box } from '@mui/material';
import type { NextPage, GetServerSideProps } from 'next'
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products/ProductList';
import { dbProduct } from '../../database'
import { IProduct } from '../../interfaces';


interface Props {
    products: IProduct[];
    productosEncontrados: boolean;
    query: string
}



const SearchPage: NextPage <Props> = ({ products, productosEncontrados, query }) => {



  return (
    <ShopLayout title={ 'Teslo-Shop - Search' } pageDescription={ 'Encuentra los mejores productos aqui' }>
      <Typography variant='h1' component='h1' >Buscar producto</Typography>

        {
            productosEncontrados 
            ? <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>Búsqueda: { query }</Typography>
            : (
                <Box display='flex'>
                    <Typography variant='h2' sx={{ mb: 1 }} >No encontramos ningun producto</Typography>
                    <Typography variant='h2' sx={{ ml: 1 }} color="secondary" textTransform='capitalize'>{ query }</Typography>
                </Box>
            )
        }

      <ProductList products={ products } />

    </ShopLayout>
  )
}



export const getServerSideProps: GetServerSideProps = async ({ params }) => {
 
    const { query = '' } = params as { query: string };

    if( query.length === 0 ){
        return {
            redirect:{
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await dbProduct.getProductsByTerms( query );

    const productosEncontrados = products.length > 0;

    //TODo: retornar otros productos si no encuentro exactamente

    if( !productosEncontrados ){
        products = await dbProduct.getAllProducts();
    }

    return {
        props: {
            products, 
            productosEncontrados,
            query
        }
    }

}


export default SearchPage;
