import { useState } from 'react';
import { useAuth } from '../contexts/UserContext';
import { useOrganiserContext } from '../contexts/OrganiserContext';
import { createEvent } from '../features/events/createEvent';
import type { Event } from '../types/event';

interface CreateEventFormProps {
    onEventCreated: () => void;
    onCancel: () => void;
}

export default function CreateEventForm({ onEventCreated, onCancel }: CreateEventFormProps) {
    const { session } = useAuth();
    const { organiserProfile } = useOrganiserContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!session || !organiserProfile) {
            setError('Authentication or organiser profile required');
            setIsSubmitting(false);
            return;
        }

        try {
         const formData = new FormData(event.currentTarget);
        const eventData: Event = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            location: formData.get('location') as string,
            date: new Date(formData.get('date') as string + ':00').toISOString(),
            organiserId: organiserProfile.id || '',
            };

            await createEvent(eventData, session.access_token);
            onEventCreated();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create event');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <h2>Create New Event</h2>
            
            <form onSubmit={handleSubmit}>
                <label>
                    Event Title:
                    <input type="text" name="title" required />
                </label>

                <label>
                    Description:
                    <input type="text" name="description" required />
                </label>

                <label>
                    Location:
                    <input type="text" name="location" required />
                </label>

                <label>
                    Date & Time:
                    <input 
                        type="datetime-local" 
                        name="date" 
                        required 
                        step="1800"
                    />
                </label>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Event'}
                </button>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}
