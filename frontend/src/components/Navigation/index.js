import React from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import meetupIcon from '../../images/meetup_icon.png'
import { thunkDeleteGroup } from '../../store/group';
import { thunkDeleteEvent } from '../../store/event';

function Navigation({ isLoaded, type }) {
    const sessionUser = useSelector(state => state.session.user);
    const groups = useSelector((state) => state.groups.allGroups);
    const events = useSelector((state) => state.events.allEvents);
    const { groupId, eventId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    //check once groups as loaded and type is passed as groupDetails
    //if sessionUser is organizer of current group

    function editGroupRedirect(groupId) {
        history.push(`/group/${groupId}/edit`);
    };

    function createEventRedirect(groupId) {
        history.push(`/group/${groupId}/event/create`);
    }

    function createGroupRedirect() {
        history.push(`/group/create`)
    }

    function deleteGroup(groupId){
        dispatch(thunkDeleteGroup(groupId)); 
        history.push('/home/groups')
    }

    let createEventButton;
    let editButton;
    let createGroupButton;
    let deleteButton; 
    if (type === 'groupDetails' && groups && sessionUser) {
        if (sessionUser.id === groups[+groupId].organizerId) {
            editButton = (
                <li>
                    <button className="EditGroupButton" onClick={() => editGroupRedirect(+groupId)}>Edit Group</button>
                </li>);
            createEventButton = (<li>
                <button className="CreateEventButton" onClick={() => createEventRedirect(+groupId)}>Create Event</button>
            </li>)
            createGroupButton = (<li>
                <button className="CreateGroupButton" onClick={() => createGroupRedirect()}>Start a new Group</button>
            </li>)
            deleteButton = (<li>
                <button className="DeleteGroupButton" onClick={() => deleteGroup(+groupId)}>Delete Group</button>
            </li>)
        }
    }

    function deleteEvent(eventId){
        dispatch(thunkDeleteEvent(eventId)); 
        history.push('/home/events')
    }

    if (type === 'eventDetails' && events && sessionUser){
        //find organizer from eventId
        const tempGroupId = events[+eventId].groupId; 
        console.log(tempGroupId)
        if (sessionUser.id === groups[tempGroupId].organizerId){
            deleteButton = (<li>
                <button className="DeleteEventButton" onClick={() => deleteEvent(+eventId)}>Delete Event</button>
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
                    modalComponent={<LoginFormModal />}
                />
                <OpenModalButton
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
