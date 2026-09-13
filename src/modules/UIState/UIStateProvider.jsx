import { UIStateContext } from './UIStateContext.js';
import { useUIState } from './useUIState.jsx';

export function UIStateProvider({ children }) {
    const ui = useUIState();
    return (
        <UIStateContext.Provider value={ui}>
            {children}
        </UIStateContext.Provider>
    )
}
