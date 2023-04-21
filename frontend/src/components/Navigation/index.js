import React from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import meetupIcon from '../../images/gatherUpIcon.png'
import { thunkDeleteEvent } from '../../store/event';
import * as sessionActions from "../../store/session";

function Navigation({ isLoaded, type }) {
    const sessionUser = useSelector(state => state.session.user);
    const groups = useSelector((state) => state.groups.allGroups);
    const events = useSelector((state) => state.events.allEvents);
    const { groupId, eventId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    //check once groups as loaded and type is passed as groupDetails
    //if sessionUser is organizer of current group

    function createEventRedirect(groupId) {
        history.push(`/group/${groupId}/event/create`);
    }

    function createGroupRedirect() {
        history.push(`/group/create`)
    }

    let createEventButton;
    let editButton;
    let createGroupButton;
    let deleteButton;
    let yourEventButton; 


    if ((type === "splash" && sessionUser) || (type === "home" && sessionUser) || (type === "eventDetails" && sessionUser) || ((type === "groupDetails" && sessionUser))) {
        createGroupButton = (<li>
            <button className="CreateGroupButton sessionButtons" onClick={() => createGroupRedirect()}>Start a new Group</button>
        </li>)
        yourEventButton = <div className='CreateEventButton sessionButtons' onClick={()=>history.push('/')}>Your Events</div>
    }

    if (type === 'groupDetails' && groups && sessionUser) {
        if (sessionUser.id === groups[+groupId].organizerId) {
            createEventButton = (<li>
                <button className="CreateEventButton sessionButtons" onClick={() => createEventRedirect(+groupId)}>Create Event</button>
            </li>)
            createGroupButton = (<li>
                <button className="CreateGroupButton sessionButtons" onClick={() => createGroupRedirect()}>Start a new Group</button>
            </li>)
        }
    }

    function deleteEvent(eventId) {
        dispatch(thunkDeleteEvent(eventId));
        history.push('/home/events')
    }

    if (type === 'eventDetails' && events && sessionUser) {
        //find organizer from eventId
        const tempGroupId = events[+eventId].groupId;
        console.log(tempGroupId)
        if (sessionUser.id === groups[tempGroupId].organizerId) {
            deleteButton = (<li>
                <button className="DeleteEventButton sessionButtons" onClick={() => deleteEvent(+eventId)}>Delete Event</button>
            </li>)
        }
    }

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <li>
                <ProfileButton user={sessionUser} />
            </li>
        );
    } else {
        sessionLinks = (
            <li >
                <OpenModalButton
                    buttonText="Log In"
                    className="sessionButtons"
                    modalComponent={<LoginFormModal />}
                />
                <OpenModalButton
                    className="sessionButtons"
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                />
            </li>
        );
    }

    return (
        <ul className='navBar'>
            <li>
                <NavLink exact to="/">
                    <img className='meetupIcon' src={meetupIcon} alt="" />
                </NavLink>
            </li>
            <div className="rightButtons">
                {sessionUser ? null : <li >
                    <button onClick={() => {
                        dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' })).then(() => {
                            history.push('/')
                        })
                    }} className="sessionButtons">DemoUser</button>
                </li>}
                {yourEventButton}
                {createGroupButton}
                {editButton}
                {createEventButton}
                {deleteButton}
                {isLoaded && sessionLinks}
            </div>
        </ul>
    );
}

export default Navigation;
