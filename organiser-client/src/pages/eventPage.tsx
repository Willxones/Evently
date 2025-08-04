import type { Event } from '../types/event';
import type { TicketType } from '../types/ticketType';
import { useParams } from 'react-router';
import { useAuth } from '../contexts/UserContext';
import { useState, useEffect } from 'react';
import { getTicketTypesByEventId } from '../features/tickets/getTicketTypeByEventId';
import { deleteTicketType } from '../features/tickets/deleteTicketType';
import CreateTicketForm from '../components/CreateTicketForm';

export default function EventPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const { session, isAuthResolved } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingTickets, setIsLoadingTickets] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCreateTicketForm, setShowCreateTicketForm] = useState(false);
    const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
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

                const response = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}/organiser/get-event/${eventId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${session.access_token}`,
                        },
                    }
                );
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

    useEffect(() => {
        const fetchTicketTypes = async () => {
            if (event?.id && session) {
                setIsLoadingTickets(true);
                try {
                    const tickets = await getTicketTypesByEventId(event.id, session.access_token);
                    setTicketTypes(tickets);
                } catch (error) {
                    console.error('Failed to fetch ticket types:', error);
                } finally {
                    setIsLoadingTickets(false);
                }
            }
        };

        fetchTicketTypes();
    }, [event?.id, session]);

    const formatData = (dateString: string) => {
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
        }).format(price / 100);
    };

    const handleTicketCreated = async () => {
        setShowCreateTicketForm(false);
        if (event?.id && session) {
            setIsLoadingTickets(true);
            try {
                const tickets = await getTicketTypesByEventId(event.id, session.access_token);
                setTicketTypes(tickets);
            } catch (error) {
                console.error('Failed to refresh ticket types:', error);
            } finally {
                setIsLoadingTickets(false);
            }
        }
    };

    const handleTicketDeleted = async () => {
        if (event?.id && session) {
            setIsLoadingTickets(true);
            try {
                const tickets = await getTicketTypesByEventId(event.id, session.access_token);
                setTicketTypes(tickets);
            } catch (error) {
                console.error('Failed to refresh ticket types:', error);
            } finally {
                setIsLoadingTickets(false);
            }
        }
    };

    const handleDeleteTicket = async (ticketId: string) => {
        if (!session) return;

        setDeletingTicketId(ticketId);
        try {
            await deleteTicketType(ticketId, session.access_token);
            handleTicketDeleted();
        } catch (error) {
            console.error('Failed to delete ticket type:', error);
            alert('Failed to delete ticket type. Please try again.');
        } finally {
            setDeletingTicketId(null);
        }
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
        <div>
            <div style={{ padding: '20px', margin: '0 auto' }}>
                <h1>{event.title}</h1>
                <p>Description: {event.description}</p>
                <p>Location: {event.location}</p>
                <p>Date: {formatData(event.date)}</p>
            </div>
            <div>
                <div className="current-tickets">
                    <h2>Current Ticket Types</h2>
                    {isLoadingTickets && <p>Loading ticket types...</p>}
                    {!isLoadingTickets && ticketTypes.length === 0 && (
                        <p>No ticket types created yet.</p>
                    )}
                    {!isLoadingTickets && ticketTypes.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {ticketTypes.map(ticket => (
                                <div
                                    key={ticket.id}
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '15px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <h3>{ticket.name}</h3>
                                        <p>
                                            <strong>Price:</strong> {formatPrice(ticket.price)}
                                        </p>
                                        <p>
                                            <strong>Quantity:</strong> {ticket.quantity}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteTicket(ticket.id)}
                                        disabled={deletingTicketId === ticket.id}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {deletingTicketId === ticket.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {!showCreateTicketForm ? (
                    <button onClick={() => setShowCreateTicketForm(true)}>Create Ticket</button>
                ) : (
                    <CreateTicketForm
                        eventId={event.id!}
                        onTicketCreated={handleTicketCreated}
                        onCancel={() => setShowCreateTicketForm(false)}
                    />
                )}
            </div>
        </div>
    );
}