import React from 'react';
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { thunkCreateGroup } from '../../../store/group';
import GroupCardComponent from './GroupCard';
import './ShowAllGroups.css';

function ShowAllGroupsComponent() {
    const dispatch = useDispatch();

    //get info from all group states

    const groups = useSelector((state) => state.groups);
    if (Object.values(groups).length === 0) {
        return null;
    }
    else {
        console.log('group', groups);
        const groupValues = Object.values(groups.allGroups);
        console.log('groupValues', groupValues)
        //use map, to parse through groups, show all the groups
        return (
            <div className='outerDiv'>
                {groupValues.map((group) => {
                    return <GroupCardComponent key={group.id} group={group} />
                })}
            </div>
        );
    }

}

export default ShowAllGroupsComponent;
