import { useEffect } from 'react';
import { useAuth } from '../../contexts/UserContext';
import { useOrganiserContext } from '../../contexts/OrganiserContext';
import { signOut } from '../../features/auth/signOut';

export default function Home() {
    const { user, isAuthResolved } = useAuth();
    const { organiserProfile, setOrganiserProfile } = useOrganiserContext();

    useEffect(() => {
        const fetchOrganiserProfile = async () => {
            if (isAuthResolved && user?.id) {
                try {
                    const response = await fetch('/api/organiser/get-organiser-profile', {
                        headers: {
                            // Authorization: `Bearer ${user.token}`,
                        },
                    });

                    if (response.ok) {
                        const profile = await response.json();
                        setOrganiserProfile(profile);
                    } else {
                        console.error('Failed to fetch organiser profile');
                    }
                } catch (error) {
                    console.error('Error fetching organiser profile:', error);
                }
            }
        };

        fetchOrganiserProfile();
    }, [isAuthResolved, user, setOrganiserProfile]);

    return (
        <>
            <h1>Hello {user?.email || 'World!'}</h1>
            {!user ? <a href="/signin">Sign In</a> : <a onClick={signOut}>Sign Out</a>}
            {organiserProfile && (
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
