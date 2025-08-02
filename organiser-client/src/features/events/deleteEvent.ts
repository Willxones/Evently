async function deleteEvent(eventId: string, token: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/organiser/delete-event/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error deleting event: ${errorData.error}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to delete event:', error);
        throw error;
    }
}

export { deleteEvent };
