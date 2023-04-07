import './Group.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { thunkLoadSingleMembership } from '../../../../store/member';
import { useHistory, useParams } from 'react-router-dom';

function GroupSingleMemberComponent(props) {
    //dispatch action to get all events from a group by its id 
    //render cards for each event 
    //get events that are from each group
    const dispatch = useDispatch();
    const history = useHistory()
    const memberInfo = useSelector((state) => state.members.groupMembers)
    const { groupId } = useParams()
    useEffect(() => {
        dispatch(thunkLoadSingleMembership(Number(groupId)))
    }, [dispatch])

    if (!memberInfo) {
        return null;
    }
    console.log("=======================<> hits component")

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    console.log("memberInfo", memberInfo)

    let singleMember = {}
    for (let i = 0; i < memberInfo.length; i++) {
        console.log(memberInfo[i].id)
        if (memberInfo[i].id === Number(props.group.memberId)) {
            singleMember = memberInfo[i];
            break;
        }
    }

    console.log(singleMember, 'singleMember')

    return (
        <div className='groupDetailsEventCardOuterDiv'>
            <div className='groupDetailsEventCardLeftDiv'></div>
            <div className='groupDetailsMemberCardRightDiv'>
                <div className='groupDetailsMemberDiv'>
                    <div className='groupDetailsSingleMemberContainer'>
                        <div className='groupDetailsSingleMemberLeft'>
                            <div className='singleCircleProfile'>{singleMember.firstName[0]}{singleMember.lastName[0]}</div>
                        </div>
                        <div className='groupDetailsSingleMemberRight'>
                            <div className='topDiv'>
                                <div className='singleMemberProfileName'>
                                    {singleMember.firstName} {singleMember.lastName}
                                </div>
                                <div className='singleMemberProfileStatus'>
                                    {singleMember.Membership.status}
                                </div>
                            </div>
                            <div className='bottomDiv'>
                                <div className='singleMemberProfileLocation'>
                                    {singleMember.firstName} {singleMember.lastName}
                                </div>
                                <div className='singleMemberProfileJoinedTime'>
                                    {singleMember.Membership.status}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupSingleMemberComponent;
