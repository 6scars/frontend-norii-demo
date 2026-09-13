import { useContext } from 'react';
import { UIStateContext } from './UIStateContext.js';

export function useUIStateContext(){
    return useContext(UIStateContext)
}
