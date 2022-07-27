import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';

import { Button,  Grid, Typography, Chip } from '@mui/material';
import { Box } from '@mui/system';

import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ItemCounter } from '../../components/ui';
import { IProduct, ICartProduct, ISize } from '../../interfaces/';
import { dbProduct } from '../../database';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { CartContext } from '../../context';




// const producto = initialData.products[0]


interface Props {
  producto: IProduct
}



const ProductPage: NextPage <Props> = ({ producto }) => {

  //! voy a querer renderizar esta info sacandola del lado del servidor:
  // const { slug } = useRouter().query;
  // const { products: producto, isLoading } = useProducts(`/product/${ slug }`)


  const router = useRouter();

  const { addProductToCart } = useContext( CartContext );


  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id:  producto._id,
    image: producto.images[0],
    price: producto.price,
    size: undefined,
    slug: producto.slug,
    title: producto.title,
    gender: producto.gender,
    quantity: 1,
  });


  const selectedSize = ( size: ISize ) => {
    setTempCartProduct ( productoElegido => ({
      ...productoElegido,
      size
    }) )
  }


  const updateQuantity = ( quantity: number ) => {
    setTempCartProduct ( productoElegido => ({
      ...productoElegido,
      quantity
    }) )
  } 


  const onAddProduct = () => {
    if( !tempCartProduct.size ) return;

    addProductToCart( tempCartProduct );
    router.push('/cart');
  }


  return (
    <ShopLayout title={ producto.title } pageDescription={ producto.description }>
      <Grid container spacing={ 3 }>

        <Grid item xs={ 12 } sm={ 7 }>
          <ProductSlideshow images={ producto.images } />
        </Grid>


        <Grid item xs={ 12 } sm={ 5 }>

          <Box display='flex' flexDirection='column'>

          {/* titulos */}
            <Typography variant='h1' component='h1'>{ producto.title }</Typography>
            <Typography variant='subtitle1' component='h2'>${ producto.price }</Typography>
          
          {/* cantidad */}
            <Box sx={{ my: 2 }}>

              <Typography variant='subtitle2'>Cantidad:</Typography>

              <ItemCounter 
                currentValue={ tempCartProduct.quantity }
                updateQuantity={ updateQuantity }
                maxValue={ producto.inStock > 10 ? 10 : producto.inStock }
              />

              <SizeSelector 
                  selectedSize={ tempCartProduct.size }
                  sizes={ producto.sizes }
                  onSelectedSize = { selectedSize } 
              />

            </Box>

            {/* Agregar al carrito */}
            {
              producto.inStock > 0
              ? (
                <Button 
                  color="secondary" 
                  className='circular-btn'
                  onClick={ onAddProduct }
                >
                  { 
                    tempCartProduct.size
                    ? 'Agregar al carrito'
                    : 'Seleccione un talle'
                  }
                </Button>
                )
              :(
                <Chip label='No hay disponibles' color="error" variant='outlined'/>
              )
            }
          
            {/* Description */}
            <Box sx={{ mt:3 }}>

              <Typography variant='subtitle2'>Descripción:</Typography>
              <Typography variant='body2'>{ producto.description }</Typography>

            </Box>
          </Box>

        </Grid>

      </Grid>
    </ShopLayout>
  )
}


// getServerSideProps
//! NO USAR esto::
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  
//   const { slug = '' } = params as { slug: string };

//   const product = await dbProduct.getProductBySlug( slug );

//   if (! product ){
//     return {
//       redirect:{
//         destination: '/',
//         permanent: false,
//       }
//     }
//   }


//   return {
//     props:{
//       producto: product
//     }
//   }

// }




//* getStaticPaths...
// blocking

export const getStaticPaths: GetStaticPaths = async (ctx) => {

  const productSlugs = await dbProduct.getAllProductsSlugs();

  return {
    paths: productSlugs.map( ({ slug }) =>({
      params: {
        slug,
      },
    })),
    fallback: "blocking"
  }
}




//* getStaticProps...
// revalidar cada 24 hrs

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug = '' } = params as { slug: string }

  const product = await dbProduct.getProductBySlug( slug );

  if ( !product ){
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props:{
      producto: product
    }
  }
}





export default ProductPage;