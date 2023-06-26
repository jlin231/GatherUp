import { useHistory } from 'react-router-dom';
import './EventCard.css';

function EventCardComponent({ event }) {
    const history = useHistory();

    const weekday = ["SUN", "MON", "TUES", "WED", "THU", "FRI", "SAT"];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    const date = new Date(event.startDate);
    const month = date.getMonth();
    const day = date.getDay();
    const day_number = date.getDate();
    const minutes = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

    const dateString1 = `${weekday[day]}, ${months[month]} ${day_number}`
    const dateString2 = `${minutes} PST`;

    console.log('eventCardComponet', event)

    if (!event) {
        return null;
    }

    return (
        <div className="eventCardDivOuter" onClick={() => history.push(`/event/${event.id}`)}>
            <div className="eventCard-left-div">
                <img className='eventCard-previewImg' src={event.previewImage} alt="Not Found" />
            </div>
            <div className="eventCard-right-div">
                <div id="eventCard-right-div-upper-div">

                    <div className='eventDateCard'>{dateString1} &#183; {dateString2}</div>
                    <div className='eventNameCard'>{event.name}</div>
                    <div className='eventGroupInfoCard'>{`${event.Group.name}`} &#183; {`${event.Group.city}, ${event.Group.state}`}</div>
                </div>
                <div className='eventAttendeesCard'>{event.numAttending} attendees </div>
            </div>
        </div>
    );
}

export default EventCardComponent;
