async function deleteTicketType(ticketId: string, token: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/organiser/delete-ticket-type/${ticketId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error deleting ticket type: ${errorData.error}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to delete ticket type:', error);
        throw error;
    }
}

export { deleteTicketType };