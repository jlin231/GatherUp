import React, { useEffect } from 'react';
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import EventCardComponent from '../ShowAllEvents/EventCard';
import './UserEvents.css';
import { thunkLoadEvents } from '../../../store/event';

function UserEvents() {
    //get info from all event states
    const dispatch = useDispatch()

    const events = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(thunkLoadEvents())
    }, [dispatch]);

    if (Object.values(events).length === 0) {
        return null;
    }
    else {
        console.log('event', events);
        const eventValues = Object.values(events.allEvents);
        console.log('eventValues', eventValues)
        //use map, to parse through events, show all the events
        return (
            <div className="outerDivShowAllEvents">
                {eventValues.map((event) => {
                    return <EventCardComponent key={event.id} event={event} />
                })}
            </div>
        );
    }

}

export default UserEvents;
