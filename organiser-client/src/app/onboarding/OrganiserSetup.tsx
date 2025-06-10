import type { Dispatch } from 'react';
import { useAuth } from '../../contexts/UserContext';
import { createProfile } from '../../features/profile/createOrganiserProfile';
import type { OrganiserProfile } from '../../types/organiser';

interface OrganiserSetupProps {
    setStep: Dispatch<React.SetStateAction<number>>;
}

export default function OrganiserSetup({ setStep }: OrganiserSetupProps) {
    const { session, user } = useAuth();
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user || !session) {
            console.log('User not authenticated');
        } else {
            const profile: OrganiserProfile = {
                organiserName: event.currentTarget.orgName.value,
                firstName: event.currentTarget.firstName.value,
                lastName: event.currentTarget.lastName.value,
                description: event.currentTarget.description.value,
                location: event.currentTarget.location.value || null,
                logoImage: event.currentTarget.logoImage.value,
                bannerImage: event.currentTarget.bannerImage.value,
                publicEmail: event.currentTarget.email.value || null,
                socialLinks: {
                    twitter: event.currentTarget.twitter.value || null,
                },
                websiteUrl: event.currentTarget.website.value || null,
                userId: user.id,
            };
            const response = await createProfile(profile, session.access_token);
            if (response) {
                console.log('Profile created successfully:', response);
                setStep(2); // Move to the next step after successful profile creation
            }
        }
    }

    return (
        <>
            <h1>Organiser Setup</h1>
            <p>Set up your organiser</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label>
                    Organiser Name:
                    <input type="text" name="orgName" required />
                </label>
                <label>
                    First Name:
                    <input type="text" name="firstName" required />
                </label>
                <label>
                    Last Name:
                    <input type="text" name="lastName" required />
                </label>
                <label>
                    Location:
                    <input type="text" name="location" />
                </label>
                <label>
                    Logo Image URL:
                    <input type="url" name="logoImage" required />
                </label>
                <label>
                    Banner Image URL:
                    <input type="url" name="bannerImage" />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" required />
                </label>
                <label>
                    Display Email:
                    <input type="email" name="email" />
                </label>
                <label>
                    Website:
                    <input type="url" name="website" />
                </label>
                <label>
                    Twitter URL:
                    <input type="url" name="twitter" />
                </label>
                <button className="w-32" type="submit">
                    Save
                </button>
            </form>
        </>
    );
}
