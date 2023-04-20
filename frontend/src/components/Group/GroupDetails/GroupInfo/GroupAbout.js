import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkLoadSingleMembership } from '../../../../store/member';
import './Group.css';

function GroupAboutComponent(singleGroup) {

    const dispatch = useDispatch()
    const memberInfo = useSelector((state) => state.members.groupMembers)

    useEffect(()=>{
        dispatch(thunkLoadSingleMembership(singleGroup.id))
    },[dispatch, singleGroup])
    
    if(!memberInfo){
        return null
    }

    let memberProfileArray = []
    for (let i = 0; i <= memberInfo.length; i = i + 4) {
        memberProfileArray.push(memberInfo.slice(i, i + 4))
    }

    const group = singleGroup.group;
    return (
        <div className='groupAboutOuterDiv'>
            <div id='groupAboutLeftDiv'>
                <div id="groupAboutLeftDivTopHeader">What we're about</div>
                <div>{group.about}</div>
            </div>
            <div id='groupAboutRightDiv'>
                <div id="groupAboutOrganizerText">Organizers</div>
                <div id="groupAboutOrganizerProfileText">
                    <div id="groupAboutIcon">
                        <i class="fa-solid fa-user fa-2xl" id="groupAboutOrganizerIcon"></i>
                    </div>
                    <div id="groupAboutOrganizerInfo">
                        <div>{group.Organizer.firstName} {group.Organizer.lastName[0]}.</div>
                    </div>
                </div>
                <div id="groupAboutMembersDiv">
                    Members {`(${group.numMembers})`}
                    {
                        memberProfileArray.map((memberArray)=>{
                            return (
                                <div className='rowDivMember'>
                                    {memberArray.map((member)=>{
                                        return (
                                            <div className='memberProfileButton'>{member.firstName[0]}</div>
                                        )
                                    })}
                                </div>
                            )
                        })

                    }
                </div>
            </div>
        </div>
    );
}

export default GroupAboutComponent;
