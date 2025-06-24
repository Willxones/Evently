import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/UserContext';

export function useOrganiserProfileInternal() {
    const { user, session, isAuthResolved } = useAuth();
    const [organiserProfile, setOrganiserProfile] = useState<any>(null);
    const [organiserExists, setOrganiserExists] = useState<null | boolean>(null);

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
                        setOrganiserExists(true);
                    } else if (response.status === 404) {
                        setOrganiserProfile(null);
                        setOrganiserExists(false);
                    } else {
                        setOrganiserProfile(null);
                        setOrganiserExists(null);
                        console.error('Failed to fetch organiser profile');
                    }
                } catch (error) {
                    setOrganiserProfile(null);
                    setOrganiserExists(null);
                    console.error('Error fetching organiser profile:', error);
                }
            }
        };

        fetchOrganiserProfile();
    }, [isAuthResolved, user, session]);

    return { organiserProfile, setOrganiserProfile, organiserExists, setOrganiserExists };
}
