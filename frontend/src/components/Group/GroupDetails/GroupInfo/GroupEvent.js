import './Group.css';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { thunkLoadGroupEvents } from '../../../../store/event';
import GroupEventCard from './GroupEventCard';

function GroupEventComponent(singleGroup) {
    //dispatch action to get all events from a group by its id 
    //render cards for each event 
    //get events that are from each group
    const [eventInfo, setEventInfo] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkLoadGroupEvents(singleGroup.group.id))
            .then((res) => {
                console.log('res', res);
                setEventInfo(res.Events);
            });
    }, [dispatch, singleGroup])

    console.log('events', eventInfo);
    if (eventInfo.length === 0) {
        return null;
    }


    return (
        <>
            <div className='eventCardOuterDiv'>Upcoming
                {eventInfo.map((event) => {
                    return <GroupEventCard key={event.id} event={event} />
                })}
            </div>
        </>
    );
}

export default GroupEventComponent;