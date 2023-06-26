import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const history = useHistory()

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout()).then(history.push('/'));
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
    
    return (
        <>
            <button onClick={openMenu} className="profile-button">
                {user.firstName[0]}
            </button>
            <ul className={ulClassName} ref={ulRef}>
                <li className="dropDownText">{user.username}</li>
                <li className="dropDownText">{user.firstName} {user.lastName}</li>
                <li className="dropDownText">{user.email}</li>
                <li>
                    <button onClick={logout} id="profile-log-out-button">Log Out</button>
                </li>
            </ul>
        </>
    );
}

export default ProfileButton;
