import './Group.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { thunkLoadSingleMembership } from '../../../../store/member';
import { useHistory } from 'react-router-dom';

function GroupMembersComponent(singleGroup) {
    //dispatch action to get all events from a group by its id 
    //render cards for each event 
    //get events that are from each group
    const dispatch = useDispatch();
    const history = useHistory()
    const memberInfo = useSelector((state) => state.members.groupMembers)

    useEffect(() => {
        dispatch(thunkLoadSingleMembership(singleGroup.group.id))
    }, [dispatch])

    if (!singleGroup || !memberInfo) {
        return null;
    }
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date(memberInfo[0].Membership.updatedAt)
    console.log(date, 'date')
    console.log(monthNames[date.getMonth()])

    return (
        <div className='groupDetailsEventCardOuterDiv'>
            <div className='groupDetailsEventCardLeftDiv'></div>
            <div className='groupDetailsMemberCardRightDiv'>
                <div className='groupDetailsMemberDiv'>
                    <div className='heading'>All Members</div>
                    {
                        memberInfo.map((member, index) => {
                            const date = new Date(member.Membership.updatedAt)
                            console.log(date, 'date')
                            console.log(monthNames[date.getMonth()])
                            return (
                                <div className='memberShipCard' key={index} onClick={()=>{history.push(`/group/${singleGroup.group.id}/members/${member.id}`)}}>
                                    <div className='circleProfile'>{member.firstName[0]}{member.lastName[0]}</div>
                                    <div>
                                        <div className='memberShipCardInfo'>{member.firstName} {member.lastName}</div>
                                        <div className='memberShipCardDate'>Joined {monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default GroupMembersComponent;
