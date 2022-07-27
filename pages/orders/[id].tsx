import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Card, CardContent, Divider, Grid, Typography, Box, Button, Link, Chip, CircularProgress } from "@mui/material";
import { PayPalButtons } from "@paypal/react-paypal-js";



import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import tesloApi from '../../api/testloApi';



interface Props {
    order: IOrder;
}


export type OrderResponseBody = {
    id: string;
    status:
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED";
};





const OrderPage: NextPage<Props> = ({ order }) => {



    const [isPaying, setIsPaying] = useState(false);

    const router = useRouter();

    const { shippingAddress } = order;

    const { firstName, lastName, address, address2, city, zip, phone, country } = shippingAddress


    const onOrderCompleted = async ( details: OrderResponseBody ) => {


        if ( details.status !== 'COMPLETED'){
            return alert('No hay pago de Paypal');
        }

        setIsPaying(true);


        try {
            
            const { data } = await tesloApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id
            });

            router.reload();


        } catch (error) {
            setIsPaying(false);
            console.log(error);
            alert('Error!!')
        }
    }



    return (
      <ShopLayout title='Resumen de la orden' pageDescription='Resumen de la orden de compra'> 
          <Typography variant='h1' component='h1'>Orden: { order._id }</Typography>
  
            {
                order.isPaid
                ? (
                    <Chip
                        sx={{ my: 2}}
                        label='Orden Pagada'
                        variant='outlined'
                        color='success'
                        icon={ <CreditScoreOutlined /> }
                    />
                ):
                (
                    <Chip
                        sx={{ my: 2}}
                        label='Pendiente de pago'
                        variant='outlined'
                        color='error'
                        icon={ <CreditCardOffOutlined /> }
                    /> 

                )

            }

          <Grid container className='fadeIn'>
              <Grid item xs={ 12 } sm={ 7 }>
                  <CartList products={ order.orderItems }/>
              </Grid>
              <Grid item xs={ 12 } sm={ 5 }>
                  <Card className="summary-card">
                      <CardContent>
  
                          <Typography variant="h2">Resumen ({ order.numberOfItems } { order.numberOfItems > 1 ? 'productos' : 'producto' }) </Typography>
                          
                          <Divider sx={{ my: 1 }}/>
  
                          <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Direccion de entrega</Typography>
                          </Box>

                          
                          <Typography> { firstName } { lastName }</Typography>
                          <Typography> { address } { address2 ? `, ${address2}` : '' }</Typography>
                          <Typography> { city }, { zip } </Typography> 
                          <Typography> { country } </Typography> 
                          <Typography> { phone } </Typography> 

                          <Divider sx={{ mt: 1, mb:1 }}/>
                        

                          <OrderSummary 
                            orderValues={{ 
                                numberOfItems: order.numberOfItems,
                                subTotal: order.subTotal,
                                impuesto: order.impuesto,
                                total: order.total,
                             }}
                        />
                          
                          <Box 
                            sx={{ mt: 3 }} 
                            display="flex"
                            flexDirection="column"
                          >
                            {/* todo */}
                            <Box 
                                display="flex"
                                justifyContent="center"
                                className='fadeIn'
                                sx={{ display: isPaying ? 'flex' : 'none' }}
                            >
                               <CircularProgress />

                            </Box>

                            <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection="column">
                                {
                                    order.isPaid 
                                    ?(
                                        <Chip
                                            sx={{ my: 2}}
                                            label='Orden Pagada'
                                            variant='outlined'
                                            color='success'
                                            icon={ <CreditScoreOutlined /> }
                                        />
                                    )
                                    :(
                                        <PayPalButtons
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: `${ order.total }`,
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order!.capture().then((details) => {
                                                    onOrderCompleted( details );
                                                });
                                            }}
                                        />
                                    )
                                }

                            </Box>
            
                          </Box>
  
                      </CardContent>
                  </Card>
              </Grid>
          </Grid>
  
      </ShopLayout>
    )
  }




export const getServerSideProps: GetServerSideProps = async ({ req, query}) => {
    
    const { id = ''} = query;

    const session: any = await getSession({ req });

    if ( !session ) {
        return {
            redirect: {
                destination: `/auth/login?p?=/orders/${ id }`,
                permanent: false,
            }
        }
    }

    const order = await dbOrders.getOrderById( id.toString() );

    if ( !order ){

        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            }
        }        
    }


    if ( order.user !== session.user._id ){

        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            }
        }  
    }

    
    return {
        props: {
            order
        }
    }
}



  
  export default OrderPage;