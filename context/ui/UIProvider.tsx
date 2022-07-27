import { FC, PropsWithChildren, useReducer } from 'react';
import { UIContext, uiReducer } from './';



export interface UiState{
   isMenuOpen: boolean;
}



const UI_INITIAL_STATE: UiState = {
   isMenuOpen: false,
}


export const UIProvider:FC < PropsWithChildren >= ({ children }) => {

   const [state, dispatch] = useReducer( uiReducer, UI_INITIAL_STATE )


    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - ToggleManu' })
    }


    return (
        <UIContext.Provider value={{ 
            ...state,
            
            //Methods
            toggleSideMenu,
            
            }}>
             { children }
        </UIContext.Provider>
    )
}