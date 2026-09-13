import { AuthContext } from './AuthContext.js';
import { useAuth } from './useAuth.jsx';

export function AuthProvider({ children }) {
    const auth = useAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}
