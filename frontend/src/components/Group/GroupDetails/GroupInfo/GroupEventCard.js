import './Group.css';
import { thunkLoadEventDetails } from '../../../../store/event';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'

function GroupEventCard({ eventId }) {
    console.log('eventId', eventId)
    const dispatch = useDispatch();
    const history = useHistory();
    const [event, setEvent] = useState({});
    const [hasLoaded, setHasLoaded] = useState(false);
    // console.log(event.Venue.city);

    useEffect(() => {
        dispatch(thunkLoadEventDetails(eventId)).then((res) => {
            console.log('resasdf', res);
            setEvent(res);
            setHasLoaded(true);
        });
    }, [dispatch, eventId])

    if (!hasLoaded) {
        return null;
    }

    const weekday = ["SUN", "MON", "TUES", "WED", "THU", "FRI", "SAT"];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    const date = new Date(event.startDate);
    const month = date.getMonth();
    const day = date.getDay();
    const day_number = date.getDate();
    const year = date.getFullYear();
    const minutes = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

    const dateString1 = `${weekday[day]}, ${months[month]} ${day_number} ${year}, ${minutes} PST`

    //grab info from database on event details


    let locationString = null
    if (event.Venue) {
        locationString = `${event.Venue.city}, ${event.Venue.state}`
    }

    //find preview Image from event details
    let previewImage = null;
    event.EventImages.forEach((image)=>{
        if(image.preview === true){
            previewImage = image.url; 
        }
    })

    return (
        <>
            <div onClick={() => { history.push(`/event/${event.id}`) }} className="groupDetailsEventCardDiv">
                <div className='groupDetailsEventCardTopDiv'>
                    <div className='groupDetailEventCardTopDivLeftDiv'>
                        <div id="groupDetailsDateString">{dateString1}</div>
                        <div id="groupDetailsEventName">{event.name}</div>
                        <div className='eventCardLocation'>
                            <i className="fa-solid fa-location-dot "></i>
                            <div className='locationInfo'>{locationString}</div>
                        </div>
                    </div>
                    <div className='groupDetailEventCardTopDivRightDiv'>
                        <img className='groupDetailsEventImg' src={previewImage} alt="notFound"/>
                    </div>
                </div>
                <div>
                    <div className='groupDetailEventCardDescription'>{event.description}</div>
                </div>
                <div className="eventCardAttendee">
                    <div ><i class="fa-solid fa-user"></i></div>
                    <div className='groupDetailsEventAttendees'>{event.numAttending}</div>attendees
                </div>
                <div></div>
            </div>
        </>
    );
}

export default GroupEventCard;
