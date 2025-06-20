import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/UserContext';
import { useOrganiserContext } from '../../contexts/OrganiserContext';
import { signOut } from '../../features/auth/signOut';
import { snakeToCamel } from '../../utils/case';

export default function Home() {
    const { user, session, isAuthResolved } = useAuth();
    const { organiserProfile, setOrganiserProfile } = useOrganiserContext();
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
                        const camelProfile = snakeToCamel(profile);

                        setOrganiserProfile({
                            firstName: camelProfile.firstName,
                            lastName: camelProfile.lastName,
                            orgName: camelProfile.organiserName,
                            displayEmail: camelProfile.publicEmail,
                            description: camelProfile.description,
                            logoImage: camelProfile.logoImage,
                            bannerImage: camelProfile.bannerImage,
                            socials: camelProfile.socialLinks,
                            website: camelProfile.websiteUrl,
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
    }, [isAuthResolved, user, session, setOrganiserProfile]);

    return (
        <>
            <h1>Hello {user?.email || 'World!'}</h1>
            {!user ? <a href="/signin">Sign In</a> : <a onClick={signOut}>Sign Out</a>}
            {organiserExists === false && (
                <div>
                    <p>No organiser profile found. Please create one.</p>
                </div>
            )}
            {organiserProfile && organiserExists && (
                <div>
                    <h2>Organiser Profile</h2>
                    <p>
                        Name: {organiserProfile.firstName} {organiserProfile.lastName}
                    </p>
                    <p>Organisation: {organiserProfile.orgName}</p>
                    <p>Email: {organiserProfile.displayEmail}</p>
                    <p>Description: {organiserProfile.description}</p>
                </div>
            )}
        </>
    );
}