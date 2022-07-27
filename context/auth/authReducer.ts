import { IUser } from '../../interfaces';
import { AuthState } from './';


   type AuthActionType = 
   | { type: '[AUTH] - Logout' }
   | { type: '[AUTH] - Login', payload: IUser }




   export const authReducer = ( state: AuthState, action: AuthActionType ): AuthState => {



        switch ( action.type ) {

            case '[AUTH] - Login':
                // console.log(state, action.payload)
                return {
                   ...state,
                   isLoggedIn: true,
                   user: action.payload
                }

            case '[AUTH] - Logout':
                return {
                    ...state,
                    isLoggedIn: false,
                    user: undefined
                }

            default:
                return state;
       }
   }