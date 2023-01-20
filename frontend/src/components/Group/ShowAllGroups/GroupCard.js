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

    //parse about, to only fill up two lines
    return (
        <div className="outer-div" onClick={()=>history.push(`/group/${group.id}/about`)}>
            <div className="left-div">
                <img className='previewImg' src={group.previewImage} alt="Not Found"  />
            </div>
            <div className="right-div">
                <div className='groupName'>{group.name}</div>
                <div className='groupCity'>{group.city}, {group.state}</div>
                <div className='groupAbout'>{group.about}</div>
                <div>{group.numMembers} members . {privacy}</div>
            </div>
        </div>
    );
}

export default GroupCardComponent;
