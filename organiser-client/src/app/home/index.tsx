import { signOut } from '../../features/auth/signOut';
import { useAuth } from '../../contexts/UserContext';
import { useOrganiserContext } from '../../contexts/OrganiserContext';

export default function Home() {
    const { user } = useAuth();
    const { organiserProfile, isOrganiserProfileResolved } = useOrganiserContext();

    return (
        <>
            <h1>Hello {user?.email || 'World!'}</h1>
            {!user ? <a href="/signin">Sign In</a> : <a onClick={signOut}>Sign Out</a>}
            {isOrganiserProfileResolved === false && (
                <div>
                    <p>No organiser profile found. Please create one.</p>
                </div>
            )}
            {organiserProfile && isOrganiserProfileResolved && (
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
