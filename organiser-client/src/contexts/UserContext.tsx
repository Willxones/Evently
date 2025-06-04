import { createContext, useContext } from 'react';
import { useAuthInternal } from '../hooks/useAuthInternal'; // internal only

const UserContext = createContext<ReturnType<typeof useAuthInternal> | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useAuthInternal();
    return <UserContext.Provider value={auth}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useAuth must be used within a UserProvider');
    return context;
};
