import type { Event } from '../types/event';
import { useParams } from 'react-router';
import { useAuth } from '../contexts/UserContext';
import { useState, useEffect } from 'react';

export default function EventPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const { session, isAuthResolved } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            console.log('EventId:', eventId);
            console.log('Session:', session);
            console.log('Auth resolved:', isAuthResolved);
            if (!isAuthResolved) {
                return;
            }
            if (!eventId) {
                setError('Event ID missing from URL');
                setIsLoading(false);
                return;
            }
            if (!session) {
                setError('Authentication session missing - please log in');
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/organiser/get-event/${eventId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${session.access_token}`,
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error fetching event: ${errorData.error}`);
                }

                const eventData: Event = await response.json();
                setEvent(Array.isArray(eventData) ? eventData[0] : eventData);
            } catch (error) {
                console.error('Failed to fetch event:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch event');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [eventId, session, isAuthResolved]);

    const formatData = (dateString: string) => {
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    if (!isAuthResolved || isLoading) {
        return <div>Loading...</div>;
    }


    if (error) {
        return (
            <div>
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.close()}>Close Tab</button>
            </div>
        );
    }

    if (!event) {
        return <div>No event found</div>;
    }

    return (
        <div style={{ padding: '20px', margin: '0 auto' }}>
            <h1>{event.title}</h1>
            <p>
                <strong>Description:</strong> {event.description}
            </p>
            <p>
                <strong>Location:</strong> {event.location}
            </p>
            <p>
                <strong>Date:</strong> {formatData(event.date)}
            </p>
        </div>
    );
}