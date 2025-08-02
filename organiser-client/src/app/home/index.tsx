import { useState, useEffect } from 'react';
import { signOut } from '../../features/auth/signOut';
import { useAuth } from '../../contexts/UserContext';
import { useOrganiserContext } from '../../contexts/OrganiserContext';
import CreateEventForm from '../../components/CreateEventForm';
import EventCard from '../../components/EventCard';
import { getEventsByOrganiserId } from '../../features/events/getEvents';
import type { Event } from '../../types/event';

export default function Home() {
    const { user, session } = useAuth();
    const { organiserProfile, isOrganiserProfileResolved } = useOrganiserContext();
    const [showCreateEventForm, setShowCreateEventForm] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    const eventCount = events.length;

    useEffect(() => {
        const fetchEvents = async () => {
            if (organiserProfile?.id && session) {
                setIsLoadingEvents(true);
                try {
                    const fetchedEvents = await getEventsByOrganiserId(
                        organiserProfile.id,
                        session.access_token
                    );
                    setEvents(fetchedEvents);
                } catch (error) {
                    console.error('Failed to fetch events:', error);
                } finally {
                    setIsLoadingEvents(false);
                }
            }
        };

        fetchEvents();
    }, [organiserProfile?.id, session]);

    const handleEventCreated = () => {
        setShowCreateEventForm(false);
        console.log('Event created successfully!');
        if (organiserProfile?.id && session) {
            getEventsByOrganiserId(organiserProfile.id, session.access_token)
                .then(setEvents)
                .catch(console.error);
        }
    };

    return (
        <>
            <h1>Hello {user?.email || 'World!'}</h1>
            {!user ? <a href="/signin">Sign In</a> : <a onClick={signOut}>Sign Out</a>}
            {isOrganiserProfileResolved === false && (
                <div>
                    <p>No organiser profile found. Please create one.</p>
                </div>
            )}
            {organiserProfile && isOrganiserProfileResolved && (
                <div>
                    <h2>Organiser Profile</h2>
                    <p>
                        Name: {organiserProfile.firstName} {organiserProfile.lastName}
                    </p>
                    <p>Organisation: {organiserProfile.organiserName}</p>
                    <p>Email: {organiserProfile.publicEmail}</p>
                    <p>Description: {organiserProfile.description}</p>

                    {!showCreateEventForm ? (
                        <button onClick={() => setShowCreateEventForm(true)}>Create Event</button>
                    ) : (
                        <CreateEventForm
                            onEventCreated={handleEventCreated}
                            onCancel={() => setShowCreateEventForm(false)}
                        />
                    )}

                    {isLoadingEvents && <p>Loading events...</p>}

                    {organiserProfile && eventCount > 0 && (
                        <div>
                            <h3>Your Events ({eventCount})</h3>
                            {events.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onEventDeleted={() => {
                                        if (organiserProfile?.id && session) {
                                            getEventsByOrganiserId(
                                                organiserProfile.id,
                                                session.access_token
                                            )
                                                .then(setEvents)
                                                .catch(console.error);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {organiserProfile && !isLoadingEvents && eventCount === 0 && (
                        <p>No events created yet. Create your first event!</p>
                    )}
                </div>
            )}
        </>
    );
}
