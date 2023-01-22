import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import './EventDetails.css';
import { thunkLoadEventDetails } from '../../../store/event';
import { thunkLoadGroupDetails } from '../../../store/group';

function getDateString(startDate) {
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date(startDate);
    const month = date.getMonth();
    const day = date.getDay();
    const day_number = date.getDate();
    const year = date.getFullYear()
    const minutes = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

    return `${weekday[day]}, ${months[month]} ${day_number}, ${year} at ${minutes}`
}

function EventDetailsComponent() {
    //get eventId
    const { eventId } = useParams();
    const dispatch = useDispatch();

    const event = useSelector((state) => state.events.singleEvent);
    const group = useSelector((state) => state.groups.singleGroup);
    const groups = useSelector((state) => state.groups.allGroups);
    //load info into single event 
    useEffect(() => {
        dispatch(thunkLoadEventDetails(eventId));
    }, [eventId, dispatch]);

    useEffect(() => {
        if (event) {
            dispatch(thunkLoadGroupDetails(event.groupId));
        }
    }, [event, dispatch])

    if (!event || !group || !groups) {
        return null;
    }

    //find preview Image from event details
    let previewImage = null;
    event.EventImages.forEach((image)=>{
        if(image.preview === true){
            previewImage = image.url; 
        }
    })

    //process start and end time into DayName, MonthName, Day, Year at
    //Hour:Minute AM/PM
    const startTime = getDateString(event.startDate);
    const endTime = (getDateString(event.endDate));
    return (
        <>
            <div id='upperMostDivEventDetails'>
                <div className='eventDetailUpperDiv'>
                    <div id="eventDetailsEventName">{event.name}</div>
                    <div id='organizerOuterDiv'>
                        <div id='leftPictureOrganizerDiv'>
                            <i className="fa-regular fa-user fa-3x "></i>
                        </div>
                        <div id='rightOrganizerDiv'>
                            <div>Hosted By</div>
                            <div id="organizerName">{group.Organizer.firstName} {group.Organizer.lastName[0]}.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='eventDetailsdetailsDiv'>
                <div id="eventDetailsLeftDiv">
                    <div className='eventDetailsImageDiv'>
                        <img className="eventDetailsPreviewImage" src={previewImage} alt="Not Found"/>
                    </div>
                    <div id="detailsText">Details</div>
                    <div id="eventDescription">{event.description}</div>
                    <div id="Attendees">Attendees ({event.numAttending})</div>
                </div>
                <div id="eventDetailsRightDiv">
                    <div id="GroupCard">
                        <div id="leftGroupCardDiv">
                            <img id='groupImage' src={groups[group.id].previewImage} alt="Not Found" />
                        </div>
                        <div id="rightGroupCardDiv">
                            <div id="rightGroupCardDivName">{group.name}</div>
                            <div>Public Group</div>
                        </div>
                    </div>
                    <div id="TimeCard">
                        <div id='TimeInfo'>
                            <div id="TimeIcon">
                                <i className="fa-solid fa-clock icon"></i>
                            </div>
                            <div id="TimeText">
                                <div>{startTime} to {endTime}</div>
                            </div>
                        </div>
                        <div id='TypeOfEvent'>
                            <div id="CameraIcon">
                                <i className="fa-solid fa-video icon"></i>
                            </div>
                            <div id="EventText">
                                <div>{event.type} event</div>
                                <div>Link visible for attendees</div>
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </>
    );
}

export default EventDetailsComponent;
