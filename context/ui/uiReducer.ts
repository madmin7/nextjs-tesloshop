

import { UiState } from './';


   type UIActionType = 
   | { type: '[UI] - ToggleManu' }



   export const uiReducer = ( state: UiState, action: UIActionType ): UiState => {

        switch ( action.type ) {
            case '[UI] - ToggleManu':
                return {
                   ...state,
                   isMenuOpen: !state.isMenuOpen
                }

            default:
                return state;
       }
   }