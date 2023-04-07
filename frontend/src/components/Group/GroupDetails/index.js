import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import './GroupDetails.css';
import { thunkLoadGroupDetails } from '../../../store/group';
import { useEffect } from 'react';
import { thunkLoadGroups, thunkDeleteGroup } from '../../../store/group';
import GroupAboutComponent from './GroupInfo/GroupAbout'
import GroupEventComponent from './GroupInfo/GroupEvent';
import GroupMembersComponent from './GroupInfo/GroupMembers';

function GroupDetailsComponent() {
    const { groupId, groupInfo } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const sessionUser = useSelector(state => state.session.user);
    const groups = useSelector((state) => state.groups);

    useEffect(() => {
        dispatch(thunkLoadGroups());
        dispatch(thunkLoadGroupDetails(groupId));
    }, [groupId, dispatch])

    const singleGroup = groups.singleGroup;
    if (!groups.allGroups[groupId] || !singleGroup || Object.values(groups).length === 0) {
        return null;
    }

    //check if current user is group organizer
    let organizerCheck = false;
    if (sessionUser && singleGroup.organizerId === sessionUser.id) {
        organizerCheck = true;
    }

    //find previewImage
    let previewImage;
    singleGroup.GroupImages.forEach((image) => {
        if (image.preview) {
            previewImage = image.url;
        };
    });

    //change based on groupInfo
    let component = null;
    if (groupInfo === 'about') {
        component = <GroupAboutComponent group={singleGroup} />;
    }
    else if (groupInfo === 'events') {
        component = <GroupEventComponent group={singleGroup} />;
    }
    else if (groupInfo === 'members') {
        component = <GroupMembersComponent group={singleGroup} />;
    }
    else if (groupInfo === 'photos') {
        component = null;
    }

    //check if current user is organizer of group
    let organizer;
    if (sessionUser) {
        if (singleGroup.organizerId === sessionUser.id) {
            organizer = true;
        }
        else organizer = false;
    }

    function editGroupRedirect(groupId) {
        history.push(`/group/${groupId}/edit`);
    };
    
    function deleteGroup(groupId) {
        dispatch(thunkDeleteGroup(groupId));
        history.push('/home/groups')
    }

    return (
        <div className="groupDetailsOuterDiv">
            <div className='groupDetailsDiv'>
                <div className='groupDetailsLeftDiv'>
                    <img className='groupDetailspreviewImage' src={`${previewImage}`} alt='Not Found' />
                </div>
                <div className='groupDetailsRightDiv'>

                    <div className='groupName'>
                        {singleGroup.name}
                    </div>
                    <div className='groupLocation'>
                        <i className="fa-solid fa-location-dot icon"></i>
                        {singleGroup.city}, {singleGroup.state}
                    </div>
                    <div>
                        <i className="fa-solid fa-user-group icon"></i> {singleGroup.numMembers} members . {singleGroup.private ? 'Private' : 'Public'} group <i class="fa-solid fa-circle-question icon"></i>
                    </div>
                    <div className='groupOrganizer'>
                        <i className="fa-regular fa-user icon"></i>
                        Organized by
                        <span className='organizerId'> {singleGroup.Organizer.firstName} {singleGroup.Organizer.lastName[0]}.</span>
                    </div>
                    {/* <div id='iconHolder'>
                        Share: <i className="fa-brands fa-square-facebook icon"></i>  <i className="fa-brands fa-twitter icon"></i>  <i className="fa-brands fa-linkedin icon"></i>  <i className="fa-solid fa-envelope icon"></i>
                    </div> */}
                </div>
            </div>
            <div className="navigationDiv">
                <div className='navigationLeftDiv'>
                    <NavLink className="groupDetailsTab aboutTab" exact to={`/group/${groupId}/about`}>About</NavLink>
                    <NavLink className="groupDetailsTab aboutTab" exact to={`/group/${groupId}/events`}>Events</NavLink>
                    <NavLink className="groupDetailsTab aboutTab" exact to={`/group/${groupId}/members`}>Members</NavLink>
                    <NavLink className="groupDetailsTab aboutTab" exact to={`/group/${groupId}/photos`}>Photos</NavLink>
                </div>

                <div className='navigationRightDiv'>
                    {organizerCheck ? <>
                        <button className="editGroupButton" onClick={() => editGroupRedirect(+groupId)}>Edit Group</button>
                        <button className="deleteGroupButton" onClick={() => deleteGroup(+groupId)}>Delete Group</button>
                    </> : null
                    }
                </div>

            </div>
            {component}
        </div>);
}

export default GroupDetailsComponent;
