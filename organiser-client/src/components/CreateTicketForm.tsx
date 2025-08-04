import { useState } from 'react';
import { useAuth } from '../contexts/UserContext';
import type { TicketType } from '../types/ticketType';

interface CreateTicketFormProps {
    eventId: string;
    onTicketCreated: () => void;
    onCancel: () => void;
}

export default function CreateTicketForm({ eventId, onTicketCreated, onCancel }: CreateTicketFormProps) {
    const { session } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!session) {
            setError('Authentication required');
            setIsSubmitting(false);
            return;
        }

        try {
            const formData = new FormData(event.currentTarget);
            const ticketData = {
                eventId,
                name: formData.get('name') as string,
                price: Math.round(parseFloat(formData.get('price') as string) * 100),
                quantity: parseInt(formData.get('quantity') as string),
            };

            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/organiser/create-ticket-type`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(ticketData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error creating ticket: ${errorData.error}`);
            }

            onTicketCreated();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create ticket');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', margin: '10px 0' }}>
            <h3>Create New Ticket Type</h3>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>
                        Ticket Name:
                        <input 
                            type="text" 
                            name="name" 
                            required 
                            minLength={2}
                            maxLength={100}
                            style={{ marginLeft: '10px', padding: '5px' }}
                            placeholder="e.g. General Admission"
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>
                        Price (£):
                        <input 
                            type="number" 
                            name="price" 
                            required 
                            min="0"
                            step="0.01"
                            style={{ marginLeft: '10px', padding: '5px' }}
                            placeholder="0.00"
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>
                        Quantity Available:
                        <input 
                            type="number" 
                            name="quantity" 
                            required 
                            min="1"
                            style={{ marginLeft: '10px', padding: '5px' }}
                            placeholder="100"
                        />
                    </label>
                </div>

                {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Ticket'}
                    </button>
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
