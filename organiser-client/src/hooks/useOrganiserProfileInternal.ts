import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/UserContext';

export function useOrganiserProfileInternal() {
    const { user, session, isAuthResolved } = useAuth();
    const [organiserProfile, setOrganiserProfile] = useState<any>(null);
    const [isOrganiserProfileResolved, setIsOrganiserProfileResolved] = useState<boolean>(false);

    useEffect(() => {
        const fetchOrganiserProfile = async () => {
            if (isAuthResolved && user && session) {
                try {
                    const response = await fetch(
                        `${import.meta.env.VITE_SERVER_URL}/organiser/get-organiser-profile`,
                        {
                            headers: {
                                Authorization: `Bearer ${session.access_token}`,
                            },
                        }
                    );

                    if (response.ok) {
                        const profile = await response.json();
                        setOrganiserProfile({
                            firstName: profile.firstName,
                            lastName: profile.lastName,
                            orgName: profile.organiserName,
                            displayEmail: profile.publicEmail,
                            description: profile.description,
                            logoImage: profile.logoImage,
                            bannerImage: profile.bannerImage,
                            socials: profile.socialLinks,
                            website: profile.websiteUrl,
                        });
                    } else if (response.status === 404) {
                        setOrganiserProfile(null);
                    } else {
                        setOrganiserProfile(null);
                        console.error('Failed to fetch organiser profile');
                    }
                } catch (error) {
                    setOrganiserProfile(null);
                    console.error('Error fetching organiser profile:', error);
                } finally {
                    setIsOrganiserProfileResolved(true);
                }
            } else if (isAuthResolved && !user) {
                setIsOrganiserProfileResolved(true);
            }
        };

        fetchOrganiserProfile();
    }, [isAuthResolved, user, session]);

    return { organiserProfile, setOrganiserProfile, isOrganiserProfileResolved };
}
