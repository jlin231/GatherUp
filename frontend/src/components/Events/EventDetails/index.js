import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import './EventDetails.css';
import { thunkLoadEventDetails, thunkLoadEvents } from '../../../store/event';
import { thunkLoadGroupDetails } from '../../../store/group';
import { thunkApproveSingleEventAttendence, thunkDeleteSingleEventAttendence, thunkJoinSingleEventAttendence, thunkLoadSingleEventAttendence } from '../../../store/attendence';
import { thunkLoadSingleMembership } from '../../../store/member';

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
    const history = useHistory()

    const event = useSelector((state) => state.events.singleEvent);
    const group = useSelector((state) => state.groups.singleGroup);
    const groups = useSelector((state) => state.groups.allGroups);
    const attendees = useSelector((state) => state.attendence.singleAttendees)    //load info into single event 
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(thunkLoadEventDetails(eventId));
        dispatch(thunkLoadEvents());

    }, [eventId, dispatch]);

    useEffect(() => {
        if (event) {
            dispatch(thunkLoadGroupDetails(event.groupId));
        }
        dispatch(thunkLoadSingleEventAttendence(eventId))

    }, [event, dispatch])

    if (!event || !group || !groups || !attendees) {
        return null;
    }

    //find preview Image from event details
    let previewImage = null;
    event.EventImages.forEach((image) => {
        if (image.preview === true) {
            previewImage = image.url;
        }
    })
    console.log(attendees, 'attendees')
    //split attendees into arrays with 4 in each array
    let attendeesArray = []
    for (let i = 0; i <= attendees.length; i = i + 4) {
        attendeesArray.push(attendees.slice(i, i + 4))
    }

    const joinEvent = () => {
        console.log(eventId, sessionUser.id)
        dispatch(thunkJoinSingleEventAttendence(eventId)).then(() => dispatch(thunkLoadSingleEventAttendence(eventId)))
    }

    const approveAttendence = (attendeeId) => {
        console.log(eventId)
        dispatch(thunkApproveSingleEventAttendence(eventId, attendeeId)).then(() => dispatch(thunkLoadSingleEventAttendence(eventId)))
    }

    const removeAttendence = (attendeeId) => {
        console.log(eventId, attendeeId)
        dispatch(thunkDeleteSingleEventAttendence(eventId, attendeeId)).then(() => dispatch(thunkLoadSingleEventAttendence(eventId)))
    }

    let memberStatus = false
    let organizer = false
    attendees.find((attendee) => {
        if (sessionUser && sessionUser.id === attendee.id) {
            memberStatus = true
            if (sessionUser.id === group.Organizer.id) {
                organizer = true
            }
        }
    })
    console.log(memberStatus, 'memberStatus')

    let userAttendanceStatus = false
    attendees.find((attendee) => {
        if ((sessionUser && sessionUser.id) === attendee.id) {
            userAttendanceStatus = attendee.Attendance.status
            return true
        }
    })

    console.log(userAttendanceStatus, 'statusasdfa sdf asdf')
    console.log(organizer, 'organizerStatus')

    //process start and end time into DayName, MonthName, Day, Year at
    //Hour:Minute AM/PM
    const startTime = getDateString(event.startDate);
    const endTime = (getDateString(event.endDate));
    return (
        <>
            <div id='upperMostDivEventDetails'>
                <div className='eventDetailUpperDivLeft'>
                    <div id="eventDetailsEventName">{event.name}</div>
                    <div id='organizerOuterDiv'>
                        <div id='leftPictureOrganizerDiv'>
                            <i className="fa-regular fa-user fa-3x"></i>
                        </div>
                        <div id='rightOrganizerDiv'>
                            <div>Hosted By</div>
                            <div id="organizerName">{group.Organizer.firstName} {group.Organizer.lastName[0]}.</div>
                        </div>
                        {memberStatus ? (userAttendanceStatus === "attending" ? <div className='joinEventDiv'>You are Attending</div> :
                            (userAttendanceStatus === 'pending' ? <div className='joinEventDiv'>Request is Pending</div> : <div className='joinEventButton' onClick={() => joinEvent()}>Join Event</div>)) : null
                        }
                    </div>
                </div>
                <div className='eventDetailUpperDivRight'></div>
            </div>
            <div id='eventDetailsdetailsDiv'>
                <div id="eventDetailsLeftDiv">
                    <div className='eventDetailsImageDiv'>
                        <img className="eventDetailsPreviewImage" src={previewImage} alt="Not Found" />
                    </div>
                    <div id="detailsText">Details</div>
                    <div id="eventDescription">{event.description}</div>
                    <div id="Attendees">Attendees ({event.numAttending})</div>
                    {
                        attendeesArray.map((array) => {
                            return (
                                <div className='rowDiv'>
                                    {array.map((attendee) => {
                                        return (
                                            <div className="attendeesProfileDiv">
                                                <div className="attendeesProfileBlock">
                                                    <div className='attendeesProfileIcon'>{attendee.firstName[0]}</div>
                                                    <div className='attendeesName'>{attendee.firstName} {attendee.lastName[0]}.</div>
                                                    {organizer && attendee.Attendance.status === 'pending' ? <div className='approveAttendenceName' onClick={() => approveAttendence(attendee.id)}>Approve Attendance</div>
                                                        :
                                                        null
                                                    }
                                                    {organizer && attendee.Attendance.status === 'attending' && attendee.id !== group.Organizer.id ? <div className='approveAttendenceName' onClick={() => removeAttendence(attendee.id)}>Remove Attendee</div> : null}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })
                    }
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
                            <div id="EventDetailsText">
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
