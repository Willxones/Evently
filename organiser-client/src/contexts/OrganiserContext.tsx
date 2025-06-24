import { createContext, useContext } from 'react';
import { useOrganiserProfileInternal } from '../hooks/useOrganiserProfileInternal';

const OrganiserContext = createContext<ReturnType<typeof useOrganiserProfileInternal> | undefined>(
    undefined
);

export const OrganiserProvider = ({ children }: { children: React.ReactNode }) => {
    const organiser = useOrganiserProfileInternal();
    return <OrganiserContext.Provider value={organiser}>{children}</OrganiserContext.Provider>;
};

export const useOrganiserContext = () => {
    const context = useContext(OrganiserContext);
    if (!context) throw new Error('useOrganiserContext must be used within an OrganiserProvider');
    return context;
};
