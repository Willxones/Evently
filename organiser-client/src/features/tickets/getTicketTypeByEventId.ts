import type { TicketType } from '../../types/ticketType';

async function getTicketTypesByEventId(eventId: string, token: string): Promise<TicketType[]> {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/organiser/get-ticket-types/${eventId}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error fetching ticket types: ${errorData.error}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch ticket types:', error);
        throw error;
    }
}

export { getTicketTypesByEventId };