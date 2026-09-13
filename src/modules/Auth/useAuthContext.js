import { useContext } from 'react';
import { AuthContext } from './AuthContext.js';

export function useAuthContext() {
    return useContext(AuthContext)
}
