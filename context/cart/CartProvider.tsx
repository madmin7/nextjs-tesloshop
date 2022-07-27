
import axios from 'axios';
import Cookies from 'js-cookie';
import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { tesloApi } from '../../api';
import { ICartProduct, ShippingAddress, IOrder } from '../../interfaces';
import { CartContext, cartReducer } from './';



export interface CartState{
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    impuesto: number;
    total: number;
    shippingAddress?: ShippingAddress
}



const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    impuesto: 0,
    total: 0,
    shippingAddress: undefined,
}


export const CartProvider: FC <PropsWithChildren> = ({ children }) => {

    const [state, dispatch] = useReducer( cartReducer, CART_INITIAL_STATE ) 


    useEffect(() => {
        try {
            const cookiesProducts = Cookies.get('cart') ? JSON.parse( Cookies.get('cart')! ) : []
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookiesProducts })
            
        } catch (error) {
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] })
        }
    }, []);


    useEffect(() => {

        if( Cookies.get('firstName')){
            const shippingAddress = {
                firstName: Cookies.get('firstName') || '',
                lastName : Cookies.get('lastName') || '',
                address  : Cookies.get('address') || '',
                address2 : Cookies.get('address2') || '',
                zip      : Cookies.get('zip') || '',
                city     : Cookies.get('city') || '',
                country  : Cookies.get('country') || '',
                phone    : Cookies.get('phone') || ''
            }

            dispatch({ type: '[Cart] - Load address from cookies', payload: shippingAddress })
        }
    }, [])



    useEffect(() => {
       if (state.cart.length > 0) Cookies.set('cart', JSON.stringify(state.cart))
        // Cookies.set('cart', JSON.stringify(state.cart))
    }, [state.cart])
    

    useEffect(() => {
        
        const numberOfItems= state.cart.reduce( ( prev, current ) => current.quantity + prev, 0 )

        const subTotal= state.cart.reduce( ( prev, current ) => ( current.price * current.quantity ) + prev, 0 )
        
        const taxRate= Number( process.env.NEXT_PUBLIC_TAX_RATE || 0);
        

        const orderSummary = {
            numberOfItems,
            subTotal,
            impuesto: subTotal * taxRate,
            total: subTotal * ( taxRate + 1 )
        }

        dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
     }, [state.cart])




    const addProductToCart = ( product: ICartProduct ) => {

        //!Nivel1: (la que yo hice)
        // dispatch({ type: '[Cart] - Add Product', payload: product })

        //!Nivel2: || el problema es que no acumulo el precio
        //  const productInCart = state.cart.filter( p => p._id !== product._id && p.size !== product.size );
        //  dispatch({ type: '[Cart] - Add Product', payload: [...productInCart, product] })
    
        //*Nivel3 (Final):

        const productInCart = state.cart.some( p => p._id === product._id );
        if ( !productInCart ) return dispatch({ type: '[Cart] - Update products in cart', payload: [ ...state.cart, product ] })

        const productInCartButDifferentSize = state.cart.some( p => p._id === product._id && p.size === product.size );
        if ( !productInCartButDifferentSize ) return dispatch({ type: '[Cart] - Update products in cart', payload: [ ...state.cart, product ] })

        //Acumular::
        const updatedProdcuts = state.cart.map( p => {
            if ( p._id !== product._id ) return p;
            if ( p.size !== product.size ) return p;

            //Actualizar la cantidad:
            p.quantity += product.quantity;
            return p;
        })

        dispatch({ type: '[Cart] - Update products in cart', payload: updatedProdcuts })
    }


    const updateCartQuantity = ( product: ICartProduct ) => {
        dispatch({ type: '[Cart] - Change cart quantity', payload: product })
    }


    const removeCartProduct = ( product: ICartProduct ) => {
        dispatch({ type: '[Cart] - Remove product in cart', payload: product })
    }


    const updateAddress= (address: ShippingAddress) => {

        Cookies.set('firstName', address.firstName );
        Cookies.set('lastName', address.lastName );
        Cookies.set('address', address.address );
        Cookies.set('address2', address.address2 || '');
        Cookies.set('zip', address.zip );
        Cookies.set('city', address.city );
        Cookies.set('country', address.country );
        Cookies.set('phone', address.phone );

        dispatch({ type:'[Cart] - Update address', payload: address})
    }



    const createOrder = async ():Promise<{ hasError: boolean; message: string; }> => {

        if ( !state.shippingAddress ){
            throw new Error('No hay dirección de entrega');
        }

        const body: IOrder = {
            orderItems: state.cart.map( p => ({
                ...p,
                size : p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            impuesto: state.impuesto,
            total: state.total,
            isPaid: false,
        }


        try {

            const { data } = await tesloApi.post('/orders', body); 
        
            dispatch({ type: '[Cart] - Order complete' });

            return { 
                hasError: false,
                message: data._id!
            }
            

        } catch (error) {
            if ( axios.isAxiosError(error) ){
                return {
                    hasError: true,
                    message: ''
                }
            }
            return {
                hasError: true,
                message: 'Error no controlado, hable con el administrador'
            }
        }
    }


    return (
        <CartContext.Provider value={{
            ...state,

            addProductToCart,
            updateCartQuantity,
            removeCartProduct,
            updateAddress,

            createOrder
        }}>
             { children }
        </CartContext.Provider>
    )
}