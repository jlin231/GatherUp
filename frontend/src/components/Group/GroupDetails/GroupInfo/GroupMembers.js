import './Group.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { thunkLoadSingleMembership, thunkApproveSingleMembership, thunkDeleteSingleMembership } from '../../../../store/member';
import { useHistory } from 'react-router-dom';


function GroupMembersComponent(singleGroup) {
    //dispatch action to get all events from a group by its id 
    //render cards for each event 
    //get events that are from each group
    const dispatch = useDispatch();
    const history = useHistory()
    const memberInfo = useSelector((state) => state.members.groupMembers)
    const sessionUser = useSelector(state => state.session.user);
    const members = useSelector((state) => state.members)

    useEffect(() => {
        dispatch(thunkLoadSingleMembership(singleGroup.group.id))
    }, [dispatch])

    if (!singleGroup || !memberInfo) {
        return null;
    }
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    //find memberInfo, and see if user is a co-host or organizer
    let owner = false;
    let cohost = false;

    if (sessionUser) {
        memberInfo.forEach((element) => {
            if (sessionUser.id === element.id && element.Membership.status === 'co-host') {
                cohost = true
            }
        })
    }

    if (sessionUser && (sessionUser.id === singleGroup.group.organizerId)) {
        owner = true;
    }
    console.log('owner', owner)
    console.log('cohost', cohost)

    const pendingMembers = memberInfo.filter((member) => {

        if (member.Membership.status === 'pending') {
            return member;
        }
    })

    const handleApprove = (memberId) => {
        dispatch(thunkApproveSingleMembership(singleGroup.group.id, memberId))
    }

    const handleDeleteRejectMember = (memberId) => {
        dispatch(thunkDeleteSingleMembership(singleGroup.group.id, memberId))
    }

    return (
        <div className='groupDetailsEventCardOuterDiv'>
            <div className='groupDetailsEventCardLeftDiv'></div>
            <div className='groupDetailsMemberCardRightDiv'>
                <div className='groupDetailsMemberDiv'>
                    <div className='heading'>All Members</div>
                    {
                        (memberInfo.length > 0) ? memberInfo.map((member, index) => {
                            const date = new Date(member.Membership.updatedAt)
                            if (member.Membership.status !== 'pending') {
                                return (
                                    <>
                                        <div className='pendingMemberShipCard' key={index} >
                                            <div className='internalMemberDiv' onClick={() => { history.push(`/group/${singleGroup.group.id}/members/${member.id}`) }}>
                                                <div className='circleProfile'>{member.firstName[0]}{member.lastName[0]}</div>
                                                <div>
                                                    <div className='memberShipCardInfo'>{member.firstName} {member.lastName}</div>
                                                    <div className='memberShipCardDate'>Joined {monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</div>
                                                </div>
                                            </div>
                                            {
                                                (owner || cohost) && singleGroup.group.organizerId !== member.id ?
                                                    <div className='editGroupButton' onClick={() => handleDeleteRejectMember(member.id)}>
                                                        Delete Member
                                                    </div> : null
                                            }
                                        </div>
                                    </>
                                )
                            }
                        }) : <div className='memberShipCard'>Join to be this Group's First Member!</div>
                    }
                </div>
                {
                    (pendingMembers.length > 0) ?
                        <div className='groupDetailsPendingMembersDiv'>
                            <div className='heading'>Pending Members</div>
                            {
                                (pendingMembers.length > 0) ? pendingMembers.map((member, index) => {
                                    const date = new Date(member.Membership.updatedAt)
                                    if (member.Membership.status === 'pending') {
                                        return (
                                            <>
                                                <div className='pendingMemberShipCard' key={index} >
                                                    <div className='internalMemberDiv'>
                                                        <div onClick={() => { history.push(`/group/${singleGroup.group.id}/members/${member.id}`) }} className='circleProfile'>{member.firstName[0]}{member.lastName[0]}</div>
                                                        <div>
                                                            <div className='memberShipCardInfo'>{member.firstName} {member.lastName}</div>
                                                            <div className='memberShipCardDate'>Joined {monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</div>
                                                        </div>
                                                    </div>
                                                    {(owner || cohost) ?
                                                    <div className='buttonContainer'>
                                                        <div className='editGroupButton' onClick={() => handleApprove(member.id)}>
                                                            Approve Member
                                                        </div>
                                                        <div className='approveMemberButton' onClick={() => handleDeleteRejectMember(member.id)}>
                                                            Reject Member
                                                        </div>
                                                    </div>: null}
                                                </div>
                                            </>
                                        )
                                    }
                                }) : null
                            }
                        </div> : null
                }
            </div>
        </div>
    );
}

export default GroupMembersComponent;
