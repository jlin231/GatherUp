import React, { useEffect } from 'react';
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import EventCardComponent from './EventCard';
import './ShowAllEvents.css';
import { thunkLoadEvents } from '../../../store/event';

function ShowAllEventsComponent() {
    //get info from all group states

    const events = useSelector((state) => state.events);

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

export default ShowAllEventsComponent;
