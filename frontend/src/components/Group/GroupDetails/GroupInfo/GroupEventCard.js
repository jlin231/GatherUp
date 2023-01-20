import './Group.css';


function GroupEventCard({ event }) {
    console.log('event', event)
    // console.log(event.Venue.city);
    const weekday = ["SUN", "MON", "TUES", "WED", "THU", "FRI", "SAT"];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    const date = new Date(event.startDate);
    const month = date.getMonth();
    const day = date.getDay();
    const day_number = date.getDate();
    const year = date.getFullYear();
    const minutes = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

    const dateString1 = `${weekday[day]}, ${months[month]} ${day_number} ${year}, ${minutes} PST`

    let locationString = null
    if (event.Venue) {
        locationString = `${event.Venue.city}, ${event.Venue.state}`
    }

    return (
        <>
            <div className="eventCardDiv">
                <div id="dateString">{dateString1}</div>
                <div id="eventName">{event.name}</div>
                <div className='eventCardLocation'>
                    <i className="fa-solid fa-location-dot "></i>
                    <div className='locationInfo'>{locationString}</div>
                </div>
                <div className="eventCardAttendee">
                    <div><i class="fa-solid fa-user"></i></div>
                    <div>{event.numAttending} attendee</div>
                </div>
                <div></div>
            </div>
        </>
    );
}

export default GroupEventCard;
