import React from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import meetupIcon from '../../images/meetup_icon.png'

function Navigation({ isLoaded, type }) {
    const sessionUser = useSelector(state => state.session.user);
    const groups = useSelector((state) => state.groups.allGroups);
    const { groupId } = useParams();
    const history = useHistory();

    //check once groups as loaded and type is passed as groupDetails
    //if sessionUser is organizer of current group

    function edit(groupId) {
        history.push(`/group/${groupId}/edit`);
    };

    function createEventRedirect(groupId) {
        history.push(`/group/${groupId}/event/create`);
    }

    let createButton;
    let editButton;
    if (type === 'groupDetails' && groups) {
        if (sessionUser.id === groups[+groupId].organizerId) {
            editButton = (
                <li>
                    <button onClick={() => edit(+groupId)}>Edit Group</button>
                </li>);
            createButton = (<li>
                <button onClick={() => createEventRedirect(+groupId)}>Create Event</button>
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
                {editButton}
                {createButton}
                {isLoaded && sessionLinks}
            </div>

        </ul>
    );
}

export default Navigation;
