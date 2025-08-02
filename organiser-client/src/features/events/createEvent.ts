import type { Event } from '../../types/event';

async function createEvent(eventData: Event, token: string) {
    try {
        console.log('Creating event with data:', eventData);
        
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/organiser/create-event`, {
            method: 'POST',
            body: JSON.stringify(eventData),
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error creating event: ${errorData.error}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to create event:', error);
        throw error;
    }
}

export { createEvent };
