import type { OrganiserProfile } from '../../types/organiser';

async function createProfile(profileData: OrganiserProfile, token: string) {
    try {
        const response = await fetch(import.meta.env.VITE_SERVER_URL + '/organiser', {
            method: 'POST',
            body: JSON.stringify(profileData),
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error creating profile: ${errorData.message}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to create organiser profile:', error);
        throw error;
    }
}

export { createProfile };
