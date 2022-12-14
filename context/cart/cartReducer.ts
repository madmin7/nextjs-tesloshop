import { ICartProduct, ShippingAddress } from '../../interfaces';
import { CartState } from './';



   type CartActionType = 
   | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
   | { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
   | { type: '[Cart] - Change cart quantity', payload: ICartProduct }
   | { type: '[Cart] - Remove product in cart', payload: ICartProduct }
   | { type: '[Cart] - Load address from cookies', payload: ShippingAddress }
   | { type: '[Cart] - Update address', payload: ShippingAddress }
   | { 
        type: '[Cart] - Update order summary', 
        payload: {
            numberOfItems: number;
            subTotal: number;
            impuesto: number;
            total: number;
        } 
    }
   | { type: '[Cart] - Order complete' }



   export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {

        switch ( action.type ) {
            case '[Cart] - LoadCart from cookies | storage':
                return {
                   ...state,
                   isLoaded: true,
                   cart: action.payload
                }

            case '[Cart] - Update products in cart':
                return {
                    ...state,
                    cart: [ ...action.payload ]
                }

            case '[Cart] - Change cart quantity':
                return {
                    ...state,
                    cart: state.cart.map( p => {
                        if ( p._id !== action.payload._id) return p;
                        if ( p.size !== action.payload.size) return p;
                        
                        // p.quantity = action.payload.quantity

                        return action.payload;
                    })
                }

            case '[Cart] - Remove product in cart':
                return {
                    ...state,
                    // cart: state.cart.filter( p => !( p._id === action.payload._id && p.size === action.payload.size ))
                    cart: state.cart.filter( p => {
                        if( p._id === action.payload._id && p.size === action.payload.size ){
                            return false
                        }

                        return true
                    })
                }
            
            case '[Cart] - Update order summary':
                return {
                    ...state, 
                    ...action.payload
                }

            case '[Cart] - Update address':
            case '[Cart] - Load address from cookies':
                return {
                    ...state, 
                    shippingAddress: action.payload
                }
            
            case '[Cart] - Order complete':
                return {
                    ...state,
                    cart:[],
                    numberOfItems: 0,
                    subTotal: 0,
                    impuesto: 0,
                    total: 0
                }
                
            default:
                return state;
       }
   }