import { useState } from 'react';
import { useAuth } from '../contexts/UserContext';
import { deleteEvent } from '../features/events/deleteEvent';
import type { Event } from '../types/event';

interface EventCardProps {
    event: Event;
    onEventDeleted?: () => void;
}

export default function EventCard({ event, onEventDeleted }: EventCardProps) {
    const { session } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async () => {
        if (!session || !event.id) return;

            setIsDeleting(true);
            try {
                await deleteEvent(event.id, session.access_token);
                onEventDeleted?.();
            } catch (error) {
                console.error('Failed to delete event:', error);
                alert('Failed to delete event. Please try again.');
            } finally {
                setIsDeleting(false);
            }
    };

    return (
        <>
        <div style={{ border: '1px solid #ccc', padding: '16px', margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
            <div>
            <h3>{event.title}</h3>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {formatDate(event.date)}</p>
            </div>
            <div>
                <button onClick={() => window.open(`/events/${event.id}`, '_blank')}>Open Event</button>
                <button 
                    onClick={handleDelete} 
                    disabled={isDeleting}
                    style={{ marginLeft: '8px', backgroundColor: '#dc3545', color: 'white' }}
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <p>Delete function was AI rendered for ease of use. Will need to be removed before launching</p>
            </div>
        </div>
        </>
    );
}
