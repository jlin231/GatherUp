import React, { useEffect } from 'react';
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import EventCardComponent from '../ShowAllEvents/EventCard';
import './UserEvents.css';
import { thunkLoadEvents } from '../../../store/event';

function generateDate(event) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'Octover', 'November', 'December'];
    const date = new Date(event.startDate);
    const month = date.getMonth();
    const day = date.getDay();
    const day_number = date.getDate();
    return `${weekday[day]}, ${months[month]} ${day_number}`
}

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

    const eventValues = Object.values(events.allEvents);


    //use map, to parse through events, show all the events
    return (
        <>
            <div className='bigDiv'>
                <div className='leftUserEventDiv'>
                    <div>Back to home page</div>
                </div>
                <div className='rightUserEventDiv'>
                    <div className='yourEvents'>Your events</div>
                    <div className='today'>Today</div>
                    <div className="outerDivShowAllEvents">
                        {eventValues.map((event) => {

                            return (
                                <>
                                    <div className='dateAbove'>{generateDate(event)}</div>
                                    <EventCardComponent key={event.id} event={event} />
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>

        </>
    );
}

export default UserEvents;
