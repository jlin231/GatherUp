import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import './EventDetails.css';
import { thunkLoadEvents, } from '../../../store/event';

function EventDetailsComponent() {
    //get eventId
    const { eventId } = useParams();
    const dispatch = useDispatch();

    //load info into single event 
    useEffect(() => {
        dispatch(thunkLoadEvents());
        dispatch(thunkLoadGroupDetails(groupId));
    }, [eventId, dispatch])

    return null;
}

export default EventDetailsComponent;
