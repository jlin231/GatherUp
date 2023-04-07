import './Group.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { thunkLoadSingleMembership } from '../../../../store/member';

function GroupMembersComponent(singleGroup) {
    //dispatch action to get all events from a group by its id 
    //render cards for each event 
    //get events that are from each group
    const dispatch = useDispatch();

    const memberInfo = useSelector((state) => state.memberships)

    useEffect(() => {
        dispatch(thunkLoadSingleMembership(singleGroup.group.id))
    }, [dispatch, singleGroup])

    if (!singleGroup || !memberInfo) {
        return null;
    }

    return (
        <div className='groupDetailsEventCardOuterDiv'>
            <div className='groupDetailsEventCardLeftDiv'></div>
            <div className='groupDetailsEventCardRightDiv'>
                {memberInfo.groupMembers.Members.map((member) => {
                    console.log(member)
                    return (
                        <div>{member.firstName}</div>
                    )
                })}
            </div>
        </div>
    );
}

export default GroupMembersComponent;
