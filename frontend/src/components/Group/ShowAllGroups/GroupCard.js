import React from 'react';
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { thunkCreateGroup } from '../../../store/group';
import './GroupCard.css';

function GroupCardComponent({ group }) {
    // const dispatch = useDispatch();
    console.log('group prop', group)
    const history = useHistory()
    //get info from all group states
    //use map, to parse through groups, show all the groups
    let privacy;
    if (group.private) privacy = 'Private';
    else privacy = 'Public';

    let name= `${group.city}, ${group.state}`;
    name = name.toUpperCase()

    return (
        <div className="group-card-OuterDiv" onClick={() => history.push(`/group/${group.id}/about`)}>
            <div className="group-card-left-div">
                <img className='group-cardpreviewImg' src={group.previewImage} alt="Not Found" />
            </div>
            <div className="group-card-right-div">
                <div className='group-card-right-div-inner'>
                    <div className='group-card-groupName'>{group.name}</div>
                    <div className='group-card-groupCity'>{name}</div>
                    <div className='group-card-groupAbout'>{group.about}</div>
                </div>
                <div className='group-card-groupMembers'>{group.numMembers} members . {privacy}</div>
            </div>
        </div>
    );
}

export default GroupCardComponent;
