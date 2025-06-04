import { createContext, useContext, useState } from 'react';

interface OrganiserProfile {
    firstName: string;
    lastName: string;
    orgName: string;
    displayEmail: string;
    description: string;
    logoImage: string;
    bannerImage: string;
    socials?: Record<string, string>;
    website?: string;
}

interface OrganiserContextType {
    organiserProfile: OrganiserProfile | null;
    setOrganiserProfile: React.Dispatch<React.SetStateAction<OrganiserProfile | null>>;
}

const OrganiserContext = createContext<OrganiserContextType | undefined>(undefined);

export const OrganiserProvider = ({ children }: { children: React.ReactNode }) => {
    const [organiserProfile, setOrganiserProfile] = useState<OrganiserProfile | null>(null);

    return (
        <OrganiserContext.Provider value={{ organiserProfile, setOrganiserProfile }}>
            {children}
        </OrganiserContext.Provider>
    );
};

export const useOrganiserContext = () => {
    const context = useContext(OrganiserContext);
    if (!context) {
        throw new Error('useOrganiserContext must be used within an OrganiserProvider');
    }
    return context;
};