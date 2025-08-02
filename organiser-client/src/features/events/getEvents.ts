import type { Event } from '../../types/event';

async function getEventsByOrganiserId(organiserId: string, token: string): Promise<Event[]> {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/organiser/get-events/${organiserId}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error fetching events: ${errorData.error}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch events:', error);
        throw error;
    }
}

export { getEventsByOrganiserId };
